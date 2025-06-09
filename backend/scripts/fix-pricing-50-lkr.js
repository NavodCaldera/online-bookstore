const { executeQuery } = require('../config/database');

async function fixPricing() {
  try {
    console.log('🔄 Starting price conversion to 1 USD = 50 LKR...');

    // First, let's check current price range
    const priceCheck = await executeQuery(`
      SELECT 
        MIN(price) as min_price,
        MAX(price) as max_price,
        AVG(price) as avg_price,
        COUNT(*) as total_books
      FROM books
    `);

    if (priceCheck.success) {
      const stats = priceCheck.data[0];
      console.log('📊 Current Price Statistics:');
      console.log(`   📚 Total Books: ${stats.total_books}`);
      console.log(`   💰 Min Price: LKR ${stats.min_price}`);
      console.log(`   💰 Max Price: LKR ${stats.max_price}`);
      console.log(`   💰 Avg Price: LKR ${Math.round(stats.avg_price)}`);
    }

    // Check if prices seem to be in USD (typically $10-$200 range)
    // If max price > 500, likely already converted
    // If max price < 500, likely still in USD
    
    const maxPrice = priceCheck.data[0].max_price;
    
    if (maxPrice > 500) {
      console.log('⚠️  Prices appear to already be in LKR (high values detected)');
      console.log('🔄 Resetting to USD base and converting to 50 LKR rate...');
      
      // Reset to approximate USD values first (divide by previous conversion rate)
      // Assuming previous conversion was around 300-320 LKR per USD
      await executeQuery('UPDATE books SET price = ROUND(price / 300, 2)');
      console.log('✅ Reset prices to USD base');
    }

    // Now convert USD to LKR at 1 USD = 50 LKR rate
    const conversionResult = await executeQuery(`
      UPDATE books 
      SET price = ROUND(price * 50, 2)
      WHERE price < 500
    `);

    if (conversionResult.success) {
      console.log(`✅ Converted prices: ${conversionResult.data.affectedRows} books updated`);
    }

    // Verify the conversion
    const verifyResult = await executeQuery(`
      SELECT 
        MIN(price) as min_price,
        MAX(price) as max_price,
        AVG(price) as avg_price,
        COUNT(*) as total_books
      FROM books
    `);

    if (verifyResult.success) {
      const newStats = verifyResult.data[0];
      console.log('📊 Updated Price Statistics:');
      console.log(`   📚 Total Books: ${newStats.total_books}`);
      console.log(`   💰 Min Price: LKR ${newStats.min_price}`);
      console.log(`   💰 Max Price: LKR ${newStats.max_price}`);
      console.log(`   💰 Avg Price: LKR ${Math.round(newStats.avg_price)}`);
    }

    // Show some sample prices
    const sampleResult = await executeQuery(`
      SELECT title, author, price 
      FROM books 
      ORDER BY RANDOM() 
      LIMIT 10
    `);

    if (sampleResult.success) {
      console.log('📖 Sample Book Prices:');
      sampleResult.data.forEach(book => {
        console.log(`   "${book.title}" by ${book.author} - LKR ${book.price}`);
      });
    }

    console.log('✅ Price conversion completed successfully!');
    console.log('💡 Exchange Rate Applied: 1 USD = 50 LKR');

  } catch (error) {
    console.error('❌ Error fixing prices:', error);
  }
}

// Run the price fix
fixPricing().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
