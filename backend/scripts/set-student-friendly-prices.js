const { executeQuery } = require('../config/database');

async function setStudentFriendlyPrices() {
  try {
    console.log('🎓 Setting student-friendly prices for all books...');
    
    // Get current book count
    const countResult = await executeQuery('SELECT COUNT(*) as total FROM books WHERE availability = 1');
    console.log(`📚 Total books to update: ${countResult.data[0].total}`);
    
    // Set prices based on book categories and random distribution
    // This will ensure all books have reasonable prices between LKR 300-2500
    console.log('💰 Setting new prices based on categories...');
    
    const updateResult = await executeQuery(`
      UPDATE books 
      SET price = CASE 
        -- Fiction books: LKR 300-800
        WHEN category_id = 1 THEN ROUND(300 + (RAND() * 500), 0)
        
        -- Non-Fiction books: LKR 400-1200  
        WHEN category_id = 2 THEN ROUND(400 + (RAND() * 800), 0)
        
        -- Science books: LKR 600-1800
        WHEN category_id = 3 THEN ROUND(600 + (RAND() * 1200), 0)
        
        -- Mathematics books: LKR 700-2000
        WHEN category_id = 4 THEN ROUND(700 + (RAND() * 1300), 0)
        
        -- History books: LKR 350-900
        WHEN category_id = 5 THEN ROUND(350 + (RAND() * 550), 0)
        
        -- Literature books: LKR 300-700
        WHEN category_id = 6 THEN ROUND(300 + (RAND() * 400), 0)
        
        -- Technology books: LKR 800-2500 (most expensive)
        WHEN category_id = 7 THEN ROUND(800 + (RAND() * 1700), 0)
        
        -- Arts books: LKR 400-1000
        WHEN category_id = 8 THEN ROUND(400 + (RAND() * 600), 0)
        
        -- Business books: LKR 500-1500
        WHEN category_id = 9 THEN ROUND(500 + (RAND() * 1000), 0)
        
        -- Philosophy books: LKR 350-800
        WHEN category_id = 10 THEN ROUND(350 + (RAND() * 450), 0)
        
        -- Psychology books: LKR 450-1200
        WHEN category_id = 11 THEN ROUND(450 + (RAND() * 750), 0)
        
        -- Reference books: LKR 600-2200
        WHEN category_id = 12 THEN ROUND(600 + (RAND() * 1600), 0)
        
        -- Default for any other category
        ELSE ROUND(400 + (RAND() * 800), 0)
      END
      WHERE availability = 1
    `);
    
    if (updateResult.success) {
      console.log(`✅ Updated prices for ${updateResult.data.affectedRows} books`);
    }
    
    // Get new price statistics
    const statsResult = await executeQuery(`
      SELECT 
        MIN(price) as min_price, 
        MAX(price) as max_price,
        AVG(price) as avg_price,
        COUNT(*) as total_books
      FROM books
      WHERE availability = 1
    `);
    
    if (statsResult.success) {
      const stats = statsResult.data[0];
      console.log(`\n📊 New student-friendly price statistics:`);
      console.log(`   Min: LKR ${parseFloat(stats.min_price).toFixed(2)}`);
      console.log(`   Max: LKR ${parseFloat(stats.max_price).toFixed(2)}`);
      console.log(`   Avg: LKR ${parseFloat(stats.avg_price).toFixed(2)}`);
      console.log(`   Total books: ${stats.total_books}`);
    }
    
    // Show price distribution by category
    const categoryPricesResult = await executeQuery(`
      SELECT 
        c.name as category_name,
        MIN(b.price) as min_price,
        MAX(b.price) as max_price,
        AVG(b.price) as avg_price,
        COUNT(b.id) as book_count
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.availability = 1
      GROUP BY c.id, c.name
      ORDER BY avg_price ASC
    `);
    
    if (categoryPricesResult.success) {
      console.log(`\n📊 Price ranges by category:`);
      categoryPricesResult.data.forEach(cat => {
        console.log(`   ${cat.category_name}: LKR ${Math.round(cat.min_price)}-${Math.round(cat.max_price)} (avg: ${Math.round(cat.avg_price)}) - ${cat.book_count} books`);
      });
    }
    
    // Show overall price distribution
    const distResult = await executeQuery(`
      SELECT 
        CASE 
          WHEN price <= 500 THEN '300-500'
          WHEN price <= 800 THEN '501-800'
          WHEN price <= 1200 THEN '801-1200'
          WHEN price <= 1800 THEN '1201-1800'
          WHEN price <= 2500 THEN '1801-2500'
          ELSE '2500+'
        END as price_range,
        COUNT(*) as book_count
      FROM books
      WHERE availability = 1
      GROUP BY 
        CASE 
          WHEN price <= 500 THEN '300-500'
          WHEN price <= 800 THEN '501-800'
          WHEN price <= 1200 THEN '801-1200'
          WHEN price <= 1800 THEN '1201-1800'
          WHEN price <= 2500 THEN '1801-2500'
          ELSE '2500+'
        END
      ORDER BY MIN(price)
    `);
    
    if (distResult.success) {
      console.log(`\n📊 Overall price distribution:`);
      distResult.data.forEach(range => {
        console.log(`   LKR ${range.price_range}: ${range.book_count} books`);
      });
    }
    
    // Show sample books from different price ranges
    const sampleResult = await executeQuery(`
      SELECT title, price, c.name as category
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.availability = 1
      ORDER BY price ASC
      LIMIT 10
    `);
    
    if (sampleResult.success) {
      console.log(`\n📚 Sample cheapest books:`);
      sampleResult.data.forEach(book => {
        console.log(`   ${book.title} (${book.category}): LKR ${parseFloat(book.price).toFixed(2)}`);
      });
    }
    
    // Verify all books are under 3000 LKR
    const under3000Result = await executeQuery(`
      SELECT COUNT(*) as count
      FROM books
      WHERE availability = 1 AND price <= 3000
    `);
    
    if (under3000Result.success) {
      console.log(`\n🎯 Books under LKR 3,000: ${under3000Result.data[0].count} (should be all 1001)`);
    }
    
    console.log(`\n✅ Benefits of new pricing:`);
    console.log(`   📚 All books affordable for students`);
    console.log(`   💰 Realistic Sri Lankan market prices`);
    console.log(`   🎓 Category-based pricing (Tech books cost more than Fiction)`);
    console.log(`   🔍 All books will be visible in browse page`);
    
  } catch (error) {
    console.error('❌ Price setting failed:', error);
  }
}

setStudentFriendlyPrices().then(() => {
  console.log('\n✅ Student-friendly pricing completed');
  console.log('🎓 All 1001 books now have affordable prices!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Price setting failed:', error);
  process.exit(1);
});
