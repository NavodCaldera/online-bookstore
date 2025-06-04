const { executeQuery } = require('../config/database');

async function analyzeBooks() {
  try {
    console.log('🔍 Analyzing books data...');
    
    // Total books in database
    const totalResult = await executeQuery('SELECT COUNT(*) as total FROM books');
    console.log(`📚 Total books in database: ${totalResult.data[0].total}`);
    
    // Books with availability = 1
    const availableResult = await executeQuery('SELECT COUNT(*) as total FROM books WHERE availability = 1');
    console.log(`✅ Available books: ${availableResult.data[0].total}`);
    
    // Books with availability = 0
    const unavailableResult = await executeQuery('SELECT COUNT(*) as total FROM books WHERE availability = 0');
    console.log(`❌ Unavailable books: ${unavailableResult.data[0].total}`);
    
    // Books with valid categories
    const validCategoryResult = await executeQuery(`
      SELECT COUNT(*) as total 
      FROM books b 
      LEFT JOIN categories c ON b.category_id = c.id 
      WHERE b.availability = 1 AND c.id IS NOT NULL
    `);
    console.log(`🏷️ Books with valid categories: ${validCategoryResult.data[0].total}`);
    
    // Books with invalid/null categories
    const invalidCategoryResult = await executeQuery(`
      SELECT COUNT(*) as total 
      FROM books b 
      LEFT JOIN categories c ON b.category_id = c.id 
      WHERE b.availability = 1 AND c.id IS NULL
    `);
    console.log(`⚠️ Books with invalid categories: ${invalidCategoryResult.data[0].total}`);
    
    // Sample books with invalid categories
    const sampleInvalidResult = await executeQuery(`
      SELECT b.id, b.title, b.category_id 
      FROM books b 
      LEFT JOIN categories c ON b.category_id = c.id 
      WHERE b.availability = 1 AND c.id IS NULL 
      LIMIT 10
    `);
    
    if (sampleInvalidResult.data.length > 0) {
      console.log('\n📋 Sample books with invalid categories:');
      sampleInvalidResult.data.forEach(book => {
        console.log(`  ID ${book.id}: ${book.title} (category_id: ${book.category_id})`);
      });
    }
    
    // Check category distribution
    const categoryDistResult = await executeQuery(`
      SELECT c.id, c.name, COUNT(b.id) as book_count
      FROM categories c
      LEFT JOIN books b ON c.id = b.category_id AND b.availability = 1
      GROUP BY c.id, c.name
      ORDER BY book_count DESC
    `);
    
    console.log('\n📊 Category distribution:');
    categoryDistResult.data.forEach(cat => {
      console.log(`  ${cat.name}: ${cat.book_count} books`);
    });
    
    // Check what the API query returns
    console.log('\n🔍 Testing API query...');
    const apiQueryResult = await executeQuery(`
      SELECT COUNT(*) as total
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN users u ON b.seller_id = u.id
      WHERE b.availability = 1
    `);
    console.log(`🌐 Books returned by API query: ${apiQueryResult.data[0].total}`);
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
  }
}

analyzeBooks().then(() => {
  console.log('\n✅ Analysis completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Analysis failed:', error);
  process.exit(1);
});
