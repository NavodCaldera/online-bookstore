const { executeQuery } = require('../config/database');

async function reconvertPrices() {
  try {
    console.log('💱 Reconverting prices to 1 USD = 100 LKR...');
    
    // First, convert back to USD (divide by 320)
    console.log('🔄 Converting current LKR prices back to USD...');
    await executeQuery(`
      UPDATE books 
      SET price = ROUND(price / 320, 2)
      WHERE price > 100
    `);
    
    // Now convert to LKR with new rate (multiply by 100)
    console.log('💰 Converting USD to LKR at 1 USD = 100 LKR...');
    const updateResult = await executeQuery(`
      UPDATE books 
      SET price = ROUND(price * 100, 2)
      WHERE price < 100
    `);
    
    if (updateResult.success) {
      console.log(`✅ Updated ${updateResult.data.affectedRows} book prices`);
    }
    
    // Get new price statistics
    const priceStatsResult = await executeQuery(`
      SELECT 
        MIN(price) as min_price, 
        MAX(price) as max_price,
        AVG(price) as avg_price,
        COUNT(*) as total_books
      FROM books
    `);
    
    if (priceStatsResult.success) {
      const stats = priceStatsResult.data[0];
      console.log(`\n📊 New price statistics (LKR at 1 USD = 100 LKR):`);
      console.log(`   Min: LKR ${parseFloat(stats.min_price).toFixed(2)}`);
      console.log(`   Max: LKR ${parseFloat(stats.max_price).toFixed(2)}`);
      console.log(`   Avg: LKR ${parseFloat(stats.avg_price).toFixed(2)}`);
      console.log(`   Total books: ${stats.total_books}`);
    }
    
    // Show sample books with new prices
    const sampleResult = await executeQuery(`
      SELECT id, title, price 
      FROM books 
      ORDER BY price ASC 
      LIMIT 10
    `);
    
    if (sampleResult.success) {
      console.log(`\n📚 Sample books with new LKR prices (1 USD = 100 LKR):`);
      sampleResult.data.forEach(book => {
        console.log(`   ${book.title}: LKR ${parseFloat(book.price).toFixed(2)}`);
      });
    }
    
    // Show expensive books too
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
    
  } catch (error) {
    console.error('❌ Price reconversion failed:', error);
  }
}

reconvertPrices().then(() => {
  console.log('\n✅ Price reconversion completed');
  console.log('💡 Prices are now more affordable for Sri Lankan students!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Reconversion failed:', error);
  process.exit(1);
});
