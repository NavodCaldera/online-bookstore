const { executeQuery } = require('../config/database');

async function fixZeroPrices() {
  try {
    console.log('🔄 Fixing books with 0 LKR price...');

    // Check current zero-price books
    const zeroCount = await executeQuery('SELECT COUNT(*) as count FROM books WHERE price = 0');
    if (zeroCount.success) {
      console.log(`📊 Found ${zeroCount.data[0].count} books with 0 price`);
    }

    // Set minimum price for zero-price books
    // Minimum should be around LKR 250-500 (= $5-10 USD)
    console.log('💰 Setting minimum prices for zero-price books...');
    
    const updateResult = await executeQuery(`
      UPDATE books 
      SET price = ROUND((5 + (id % 10)) * 50, 2)
      WHERE price = 0
    `);

    if (updateResult.success) {
      console.log(`✅ Updated ${updateResult.data.affectedRows} books with minimum prices`);
    }

    // Verify no more zero prices
    const verifyZero = await executeQuery('SELECT COUNT(*) as count FROM books WHERE price = 0');
    if (verifyZero.success) {
      console.log(`📊 Books with 0 price after fix: ${verifyZero.data[0].count}`);
    }

    // Show new minimum prices
    const minPrices = await executeQuery(`
      SELECT title, price 
      FROM books 
      WHERE price > 0 
      ORDER BY price 
      LIMIT 10
    `);

    if (minPrices.success) {
      console.log('📚 New minimum prices:');
      minPrices.data.forEach(book => {
        const usd = book.price / 50;
        console.log(`   "${book.title}" - LKR ${book.price} ($${usd.toFixed(2)})`);
      });
    }

    // Get updated statistics
    const stats = await executeQuery(`
      SELECT 
        COUNT(*) as total_books,
        MIN(price) as min_price,
        MAX(price) as max_price,
        AVG(price) as avg_price
      FROM books 
      WHERE price > 0
    `);

    if (stats.success) {
      const data = stats.data[0];
      console.log('📊 Updated Price Statistics:');
      console.log(`   📚 Total books: ${data.total_books}`);
      console.log(`   💰 Price range: LKR ${data.min_price} - ${data.max_price}`);
      console.log(`   💰 USD range: $${(data.min_price/50).toFixed(2)} - $${(data.max_price/50).toFixed(2)}`);
      console.log(`   💰 Average: LKR ${Math.round(data.avg_price)} ($${(data.avg_price/50).toFixed(2)})`);
    }

    console.log('✅ All books now have proper minimum prices!');
    console.log('💡 No more free books - all books have value');

  } catch (error) {
    console.error('❌ Error fixing zero prices:', error);
  }
}

// Run the fix
fixZeroPrices().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
