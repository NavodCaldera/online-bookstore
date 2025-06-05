const { executeQuery } = require('../config/database');

async function checkPriceRange() {
  try {
    console.log('🔍 Checking actual price range after conversion...');
    
    // Get detailed price statistics
    const priceStatsResult = await executeQuery(`
      SELECT 
        MIN(price) as min_price, 
        MAX(price) as max_price,
        AVG(price) as avg_price,
        COUNT(*) as total_books
      FROM books
      WHERE availability = 1
    `);
    
    if (priceStatsResult.success) {
      const stats = priceStatsResult.data[0];
      console.log(`📊 Current price statistics:`);
      console.log(`   Min: LKR ${parseFloat(stats.min_price).toFixed(2)}`);
      console.log(`   Max: LKR ${parseFloat(stats.max_price).toFixed(2)}`);
      console.log(`   Avg: LKR ${parseFloat(stats.avg_price).toFixed(2)}`);
      console.log(`   Total books: ${stats.total_books}`);
    }
    
    // Check price distribution
    const priceDistResult = await executeQuery(`
      SELECT 
        CASE 
          WHEN price <= 500 THEN '0-500'
          WHEN price <= 1000 THEN '501-1000'
          WHEN price <= 1500 THEN '1001-1500'
          WHEN price <= 2000 THEN '1501-2000'
          WHEN price <= 2500 THEN '2001-2500'
          WHEN price <= 3000 THEN '2501-3000'
          WHEN price <= 4000 THEN '3001-4000'
          WHEN price <= 5000 THEN '4001-5000'
          ELSE '5000+'
        END as price_range,
        COUNT(*) as book_count
      FROM books
      WHERE availability = 1
      GROUP BY 
        CASE 
          WHEN price <= 500 THEN '0-500'
          WHEN price <= 1000 THEN '501-1000'
          WHEN price <= 1500 THEN '1001-1500'
          WHEN price <= 2000 THEN '1501-2000'
          WHEN price <= 2500 THEN '2001-2500'
          WHEN price <= 3000 THEN '2501-3000'
          WHEN price <= 4000 THEN '3001-4000'
          WHEN price <= 5000 THEN '4001-5000'
          ELSE '5000+'
        END
      ORDER BY MIN(price)
    `);
    
    if (priceDistResult.success) {
      console.log(`\n📊 Price distribution:`);
      priceDistResult.data.forEach(range => {
        console.log(`   LKR ${range.price_range}: ${range.book_count} books`);
      });
    }
    
    // Count books under 3000 LKR (current frontend filter)
    const under3000Result = await executeQuery(`
      SELECT COUNT(*) as count
      FROM books
      WHERE availability = 1 AND price <= 3000
    `);
    
    if (under3000Result.success) {
      console.log(`\n🎯 Books under LKR 3,000: ${under3000Result.data[0].count}`);
    }
    
    // Count books over 3000 LKR (being filtered out)
    const over3000Result = await executeQuery(`
      SELECT COUNT(*) as count
      FROM books
      WHERE availability = 1 AND price > 3000
    `);
    
    if (over3000Result.success) {
      console.log(`❌ Books over LKR 3,000 (filtered out): ${over3000Result.data[0].count}`);
    }
    
    // Show some expensive books
    const expensiveResult = await executeQuery(`
      SELECT title, price 
      FROM books 
      WHERE availability = 1 AND price > 3000
      ORDER BY price DESC 
      LIMIT 10
    `);
    
    if (expensiveResult.success && expensiveResult.data.length > 0) {
      console.log(`\n💎 Sample books over LKR 3,000:`);
      expensiveResult.data.forEach(book => {
        console.log(`   ${book.title}: LKR ${parseFloat(book.price).toFixed(2)}`);
      });
    }
    
    // Recommend new price range
    const maxPriceResult = await executeQuery(`
      SELECT MAX(price) as max_price
      FROM books
      WHERE availability = 1
    `);
    
    if (maxPriceResult.success) {
      const maxPrice = parseFloat(maxPriceResult.data[0].max_price);
      const recommendedMax = Math.ceil(maxPrice / 1000) * 1000; // Round up to nearest 1000
      console.log(`\n💡 Recommended frontend price range: 0 - ${recommendedMax} LKR`);
    }
    
  } catch (error) {
    console.error('❌ Price range check failed:', error);
  }
}

checkPriceRange().then(() => {
  console.log('\n✅ Price range analysis completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Analysis failed:', error);
  process.exit(1);
});
