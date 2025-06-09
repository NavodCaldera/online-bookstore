const { executeQuery } = require('../config/database');
const fs = require('fs');
const path = require('path');

async function resetToOriginalPrices() {
  try {
    console.log('🔄 Resetting to original USD prices and converting to 50 LKR...');

    // Read the original SQL file
    const sqlFilePath = path.join(__dirname, '../../resources/E-Commerce_Bookstore_Dataset.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    // Extract price data from INSERT statements
    const insertLines = sqlContent.split('\n').filter(line => 
      line.trim().startsWith('(') && line.includes('NOW()')
    );

    console.log(`📚 Found ${insertLines.length} book records in SQL file`);

    let updatedCount = 0;
    let errors = 0;

    for (const line of insertLines) {
      try {
        // Parse the line to extract ID and price
        // Format: (id, 'title', 'author', 'condition', year, 'edition', 'description', availability, category_id, rating, price, 'isbn', 'language', NOW()),
        
        const match = line.match(/^\((\d+),.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,.*?,\s*([\d.]+),/);
        if (match) {
          const id = parseInt(match[1]);
          const originalUsdPrice = parseFloat(match[2]);
          const newLkrPrice = Math.round(originalUsdPrice * 50 * 100) / 100; // Round to 2 decimal places

          // Update the price in database
          const updateResult = await executeQuery(
            'UPDATE books SET price = ? WHERE id = ?',
            [newLkrPrice, id]
          );

          if (updateResult.success && updateResult.data.affectedRows > 0) {
            updatedCount++;
            if (updatedCount <= 10) {
              console.log(`✅ ID ${id}: $${originalUsdPrice} → LKR ${newLkrPrice}`);
            }
          }
        }
      } catch (error) {
        errors++;
        if (errors <= 5) {
          console.error(`❌ Error processing line: ${error.message}`);
        }
      }
    }

    console.log(`✅ Successfully updated ${updatedCount} book prices`);
    if (errors > 0) {
      console.log(`⚠️ Encountered ${errors} errors`);
    }

    // Verify with sample books
    const verifyResult = await executeQuery(`
      SELECT id, title, price 
      FROM books 
      WHERE id IN (1,2,3,4,5)
      ORDER BY id
    `);

    console.log('🔍 Verification - Sample Prices:');
    const expectedPrices = {
      1: 41.96 * 50,  // 2098
      2: 6.35 * 50,   // 317.50
      3: 37.41 * 50,  // 1870.50
      4: 36.82 * 50,  // 1841
      5: 44.50 * 50   // 2225
    };

    verifyResult.data.forEach(book => {
      const expected = expectedPrices[book.id];
      const actual = book.price;
      const isCorrect = Math.abs(actual - expected) < 1;
      console.log(`   ID ${book.id}: LKR ${actual} (expected: LKR ${expected}) ${isCorrect ? '✅' : '❌'}`);
    });

    // Final statistics
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
      console.log('📊 Final Statistics:');
      console.log(`   📚 Total Books: ${stats.total_books}`);
      console.log(`   💰 Price Range: LKR ${Math.round(stats.min_price)} - LKR ${Math.round(stats.max_price)}`);
      console.log(`   💰 Average Price: LKR ${Math.round(stats.avg_price)} ($${Math.round(stats.avg_price / 50)})`);
    }

    console.log('🎉 Price reset completed! All prices now use 1 USD = 50 LKR conversion.');

  } catch (error) {
    console.error('❌ Error resetting prices:', error);
  }
}

// Run the reset
resetToOriginalPrices().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
