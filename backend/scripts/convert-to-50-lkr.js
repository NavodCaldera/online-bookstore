const { executeQuery } = require('../config/database');

async function convertTo50LKR() {
  try {
    console.log('💱 Converting prices to 1 USD = 50 LKR...');
    
    // Get current price range
    const priceRangeResult = await executeQuery(`
      SELECT 
        MIN(price) as min_price, 
        MAX(price) as max_price,
        AVG(price) as avg_price,
        COUNT(*) as total_books
      FROM books
    `);
    
    if (priceRangeResult.success) {
      const stats = priceRangeResult.data[0];
      console.log(`📊 Current price statistics:`);
      console.log(`   Min: LKR ${parseFloat(stats.min_price).toFixed(2)}`);
      console.log(`   Max: LKR ${parseFloat(stats.max_price).toFixed(2)}`);
      console.log(`   Avg: LKR ${parseFloat(stats.avg_price).toFixed(2)}`);
      console.log(`   Total books: ${stats.total_books}`);
    }
    
    // Step 1: Convert current LKR back to USD (assuming current rate was 320 LKR = 1 USD)
    console.log('🔄 Step 1: Converting current LKR prices back to USD...');
    await executeQuery(`
      UPDATE books 
      SET price = ROUND(price / 320, 2)
      WHERE price > 100
    `);
    
    // Step 2: Convert USD to LKR at new rate (1 USD = 50 LKR)
    console.log('💰 Step 2: Converting USD to LKR at 1 USD = 50 LKR...');
    const updateResult = await executeQuery(`
      UPDATE books 
      SET price = ROUND(price * 50, 2)
      WHERE price < 100
    `);
    
    if (updateResult.success) {
      console.log(`✅ Updated ${updateResult.data.affectedRows} book prices`);
    }
    
    // Get new price statistics
    const newPriceRangeResult = await executeQuery(`
      SELECT 
        MIN(price) as min_price, 
        MAX(price) as max_price,
        AVG(price) as avg_price
      FROM books
    `);
    
    if (newPriceRangeResult.success) {
      const newStats = newPriceRangeResult.data[0];
      console.log(`\n📊 New price statistics (1 USD = 50 LKR):`);
      console.log(`   Min: LKR ${parseFloat(newStats.min_price).toFixed(2)}`);
      console.log(`   Max: LKR ${parseFloat(newStats.max_price).toFixed(2)}`);
      console.log(`   Avg: LKR ${parseFloat(newStats.avg_price).toFixed(2)}`);
    }
    
    // Show sample books with new prices
    const sampleResult = await executeQuery(`
      SELECT id, title, price 
      FROM books 
      ORDER BY price ASC 
      LIMIT 10
    `);
    
    if (sampleResult.success) {
      console.log(`\n📚 Sample cheapest books (1 USD = 50 LKR):`);
      sampleResult.data.forEach(book => {
        console.log(`   ${book.title}: LKR ${parseFloat(book.price).toFixed(2)}`);
      });
    }
    
    // Show expensive books
    const expensiveResult = await executeQuery(`
      SELECT id, title, price 
      FROM books 
      ORDER BY price DESC 
      LIMIT 5
    `);
    
    if (expensiveResult.success) {
      console.log(`\n💎 Most expensive books:`);
      expensiveResult.data.forEach(book => {
        console.log(`   ${book.title}: LKR ${parseFloat(book.price).toFixed(2)}`);
      });
    }
    
    console.log(`\n💡 Price benefits with 1 USD = 50 LKR:`);
    console.log(`   ✅ More affordable for students`);
    console.log(`   ✅ Better price range for educational materials`);
    console.log(`   ✅ Competitive pricing in Sri Lankan market`);
    
  } catch (error) {
    console.error('❌ Price conversion failed:', error);
  }
}

convertTo50LKR().then(() => {
  console.log('\n✅ Price conversion to 50 LKR completed');
  console.log('🎓 Books are now more affordable for Sri Lankan students!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Conversion failed:', error);
  process.exit(1);
});
