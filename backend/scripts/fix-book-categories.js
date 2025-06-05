const { executeQuery } = require('../config/database');

async function fixBookCategories() {
  try {
    console.log('🔧 Fixing book categories and availability...');
    
    // Check current state
    const totalResult = await executeQuery('SELECT COUNT(*) as total FROM books');
    console.log(`📚 Total books: ${totalResult.data[0].total}`);
    
    // Fix books with category_id > 12 (map them to valid categories 1-12)
    console.log('🔄 Fixing invalid category IDs...');
    const fixCategoryResult = await executeQuery(`
      UPDATE books 
      SET category_id = ((category_id - 1) % 12) + 1 
      WHERE category_id > 12
    `);
    
    if (fixCategoryResult.success) {
      console.log(`✅ Fixed ${fixCategoryResult.data.affectedRows} books with invalid category IDs`);
    }
    
    // Fix books with NULL category_id
    const fixNullCategoryResult = await executeQuery(`
      UPDATE books 
      SET category_id = 1 
      WHERE category_id IS NULL
    `);
    
    if (fixNullCategoryResult.success) {
      console.log(`✅ Fixed ${fixNullCategoryResult.data.affectedRows} books with NULL category IDs`);
    }
    
    // Ensure all books are available
    const fixAvailabilityResult = await executeQuery(`
      UPDATE books 
      SET availability = 1 
      WHERE availability != 1 OR availability IS NULL
    `);
    
    if (fixAvailabilityResult.success) {
      console.log(`✅ Fixed ${fixAvailabilityResult.data.affectedRows} books availability`);
    }
    
    // Verify the fix
    const verifyResult = await executeQuery(`
      SELECT COUNT(*) as total
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.availability = 1 AND c.id IS NOT NULL
    `);
    
    console.log(`\n🎯 Books now available through API: ${verifyResult.data[0].total}`);
    
    // Show category distribution after fix
    const categoryDistResult = await executeQuery(`
      SELECT 
        c.name as category_name,
        COUNT(b.id) as book_count
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.availability = 1
      GROUP BY c.id, c.name
      ORDER BY book_count DESC
    `);
    
    console.log('\n📊 Category distribution after fix:');
    categoryDistResult.data.forEach(cat => {
      console.log(`  ${cat.category_name}: ${cat.book_count} books`);
    });
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
}

fixBookCategories().then(() => {
  console.log('\n✅ Book categories and availability fixed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Fix failed:', error);
  process.exit(1);
});
