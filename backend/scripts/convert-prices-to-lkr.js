const { executeQuery } = require('../config/database');

async function convertPricesToLKR() {
  try {
    console.log('💱 Converting prices from USD to LKR...');
    
    // Current USD to LKR exchange rate (approximate)
    const USD_TO_LKR = 320; // 1 USD = 320 LKR (adjust as needed)
    
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
      console.log(`📊 Current price statistics (USD):`);
      console.log(`   Min: $${stats.min_price}`);
      console.log(`   Max: $${stats.max_price}`);
      console.log(`   Avg: $${parseFloat(stats.avg_price).toFixed(2)}`);
      console.log(`   Total books: ${stats.total_books}`);
    }
    
    // Convert all prices from USD to LKR
    const updateResult = await executeQuery(`
      UPDATE books 
      SET price = ROUND(price * ${USD_TO_LKR}, 2)
      WHERE price < 1000
    `);
    
    if (updateResult.success) {
      console.log(`✅ Updated ${updateResult.data.affectedRows} book prices`);
    }
    
    // Get new price range
    const newPriceRangeResult = await executeQuery(`
      SELECT 
        MIN(price) as min_price, 
        MAX(price) as max_price,
        AVG(price) as avg_price
      FROM books
    `);
    
    if (newPriceRangeResult.success) {
      const newStats = newPriceRangeResult.data[0];
      console.log(`📊 New price statistics (LKR):`);
      console.log(`   Min: LKR ${parseFloat(newStats.min_price).toLocaleString()}`);
      console.log(`   Max: LKR ${parseFloat(newStats.max_price).toLocaleString()}`);
      console.log(`   Avg: LKR ${parseFloat(newStats.avg_price).toLocaleString()}`);
    }
    
    // Show some sample books with new prices
    const sampleResult = await executeQuery(`
      SELECT id, title, price 
      FROM books 
      ORDER BY price ASC 
      LIMIT 10
    `);
    
    if (sampleResult.success) {
      console.log(`\n📚 Sample books with LKR prices:`);
      sampleResult.data.forEach(book => {
        console.log(`   ${book.title}: LKR ${parseFloat(book.price).toLocaleString()}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Price conversion failed:', error);
  }
}

convertPricesToLKR().then(() => {
  console.log('\n✅ Price conversion completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Conversion failed:', error);
  process.exit(1);
});
