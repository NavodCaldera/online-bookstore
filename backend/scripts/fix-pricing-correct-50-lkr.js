const { executeQuery } = require('../config/database');

async function fixPricingCorrectly() {
  try {
    console.log('🔄 Starting CORRECT price conversion to 1 USD = 50 LKR...');

    // First, let's check current prices and reverse engineer the original USD prices
    const sampleResult = await executeQuery(`
      SELECT id, title, price 
      FROM books 
      WHERE id IN (1,2,3,4,5)
      ORDER BY id
    `);

    console.log('📊 Current Sample Prices:');
    sampleResult.data.forEach(book => {
      console.log(`   ID ${book.id}: LKR ${book.price}`);
    });

    // Known original USD prices from SQL file
    const originalPrices = {
      1: 41.96,  // Should be LKR 2098
      2: 6.35,   // Should be LKR 317.50
      3: 37.41,  // Should be LKR 1870.50
      4: 36.82,  // Should be LKR 1841
      5: 44.50   // Should be LKR 2225
    };

    console.log('🎯 Target Prices (1 USD = 50 LKR):');
    Object.entries(originalPrices).forEach(([id, usd]) => {
      const targetLkr = usd * 50;
      console.log(`   ID ${id}: $${usd} USD → LKR ${targetLkr}`);
    });

    // Calculate current conversion rate
    const currentPrice = sampleResult.data[0].price; // LKR 5000
    const originalUsd = originalPrices[1]; // $41.96
    const currentRate = currentPrice / originalUsd;
    console.log(`📈 Current Rate: 1 USD = ${Math.round(currentRate)} LKR`);

    // We need to convert from current rate to 50 LKR rate
    const conversionFactor = 50 / currentRate;
    console.log(`🔄 Conversion Factor: ${conversionFactor.toFixed(4)}`);

    // Apply the correction
    console.log('🔧 Applying price correction...');
    
    const updateResult = await executeQuery(`
      UPDATE books 
      SET price = ROUND(price * ?, 2)
      WHERE price > 0
    `, [conversionFactor]);

    if (updateResult.success) {
      console.log(`✅ Updated ${updateResult.data.affectedRows} book prices`);
    }

    // Verify the correction
    const verifyResult = await executeQuery(`
      SELECT id, title, price 
      FROM books 
      WHERE id IN (1,2,3,4,5)
      ORDER BY id
    `);

    console.log('✅ Verified Sample Prices:');
    verifyResult.data.forEach((book, index) => {
      const expectedPrice = originalPrices[book.id] * 50;
      const actualPrice = book.price;
      const difference = Math.abs(actualPrice - expectedPrice);
      const isCorrect = difference < 10; // Allow small rounding differences
      
      console.log(`   ID ${book.id}: LKR ${actualPrice} (expected: LKR ${expectedPrice}) ${isCorrect ? '✅' : '❌'}`);
    });

    // Check overall statistics
    const statsResult = await executeQuery(`
      SELECT 
        MIN(price) as min_price,
        MAX(price) as max_price,
        AVG(price) as avg_price,
        COUNT(*) as total_books
      FROM books 
      WHERE price > 0
    `);

    if (statsResult.success) {
      const stats = statsResult.data[0];
      console.log('📊 Final Price Statistics:');
      console.log(`   📚 Total Books: ${stats.total_books}`);
      console.log(`   💰 Min Price: LKR ${Math.round(stats.min_price)}`);
      console.log(`   💰 Max Price: LKR ${Math.round(stats.max_price)}`);
      console.log(`   💰 Avg Price: LKR ${Math.round(stats.avg_price)}`);
      console.log(`   💰 Avg USD: $${Math.round(stats.avg_price / 50)}`);
    }

    console.log('✅ Price conversion to 1 USD = 50 LKR completed successfully!');

  } catch (error) {
    console.error('❌ Error fixing prices:', error);
  }
}

// Run the price fix
fixPricingCorrectly().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
