const { executeQuery } = require('../config/database');

async function testAuthors() {
  try {
    console.log('🔍 Testing author data...');
    
    // Check raw book data
    const rawResult = await executeQuery('SELECT id, title, author FROM books LIMIT 10');
    console.log('\n📚 Raw book data from database:');
    rawResult.data.forEach(book => {
      console.log(`  ID ${book.id}: "${book.title}" by "${book.author}"`);
    });
    
    // Check API query result
    const apiResult = await executeQuery(`
      SELECT 
        b.id,
        b.title,
        b.author,
        c.name as category_name,
        u.full_name as seller_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN users u ON b.seller_id = u.id
      WHERE b.availability = 1
      LIMIT 10
    `);
    
    console.log('\n🌐 API query result:');
    apiResult.data.forEach(book => {
      console.log(`  ID ${book.id}: "${book.title}" by "${book.author}" (seller: ${book.seller_name || 'null'})`);
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAuthors().then(() => {
  console.log('\n✅ Author test completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
