const { executeQuery } = require('../config/database');

async function debugBookCount() {
  try {
    console.log('🔍 Debugging book count discrepancy...');
    
    // Total books in database
    const totalResult = await executeQuery('SELECT COUNT(*) as total FROM books');
    console.log(`📚 Total books in database: ${totalResult.data[0].total}`);
    
    // Available books (availability = 1)
    const availableResult = await executeQuery('SELECT COUNT(*) as total FROM books WHERE availability = 1');
    console.log(`✅ Available books: ${availableResult.data[0].total}`);
    
    // Books with valid categories (what the API returns)
    const apiQueryResult = await executeQuery(`
      SELECT COUNT(*) as total
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.availability = 1
    `);
    console.log(`🌐 Books returned by API query: ${apiQueryResult.data[0].total}`);
    
    // Books with NULL or invalid category_id
    const invalidCategoryResult = await executeQuery(`
      SELECT COUNT(*) as total
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.availability = 1 AND c.id IS NULL
    `);
    console.log(`⚠️ Books with invalid categories: ${invalidCategoryResult.data[0].total}`);
    
    // Check category distribution
    const categoryDistResult = await executeQuery(`
      SELECT 
        b.category_id,
        c.name as category_name,
        COUNT(b.id) as book_count
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.availability = 1
      GROUP BY b.category_id, c.name
      ORDER BY book_count DESC
    `);
    
    console.log('\n📊 Category distribution:');
    categoryDistResult.data.forEach(cat => {
      console.log(`  Category ${cat.category_id} (${cat.category_name || 'NULL'}): ${cat.book_count} books`);
    });
    
    // Check for books with category_id > 12
    const invalidIdResult = await executeQuery(`
      SELECT COUNT(*) as total
      FROM books
      WHERE category_id > 12 AND availability = 1
    `);
    console.log(`\n🔢 Books with category_id > 12: ${invalidIdResult.data[0].total}`);
    
    // Sample books with invalid categories
    const sampleInvalidResult = await executeQuery(`
      SELECT b.id, b.title, b.category_id, c.name as category_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.availability = 1 AND c.id IS NULL
      LIMIT 10
    `);
    
    if (sampleInvalidResult.data.length > 0) {
      console.log('\n📋 Sample books with invalid categories:');
      sampleInvalidResult.data.forEach(book => {
        console.log(`  ID ${book.id}: "${book.title}" (category_id: ${book.category_id})`);
      });
    }
    
    // Check the exact API query that frontend uses
    console.log('\n🔍 Testing exact API query...');
    const exactApiResult = await executeQuery(`
      SELECT COUNT(*) as total
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN users u ON b.seller_id = u.id
      WHERE b.availability = 1
    `);
    console.log(`🎯 Exact API query result: ${exactApiResult.data[0].total}`);
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugBookCount().then(() => {
  console.log('\n✅ Debug completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Debug failed:', error);
  process.exit(1);
});
