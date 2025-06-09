const { executeQuery } = require('../config/database');

async function checkCategoryBooks() {
  try {
    console.log('🔍 Checking books in Reference, Technology, and History categories...');
    
    const result = await executeQuery(`
      SELECT b.*, c.name as category_name
      FROM books b
      JOIN categories c ON b.category_id = c.id
      WHERE c.name IN ('Reference', 'Technology', 'History')
      ORDER BY c.name, b.title
      LIMIT 50
    `);
    
    if (result.success) {
      console.log('📚 Books found:');
      console.table(result.data.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category_name,
        price: book.price,
        condition: book.condition,
        rating: book.rating
      })));
      
      // Count by category
      const counts = result.data.reduce((acc, book) => {
        acc[book.category_name] = (acc[book.category_name] || 0) + 1;
        return acc;
      }, {});
      
      console.log('\n📊 Category counts:');
      console.table(counts);
      
    } else {
      console.error('❌ Failed to fetch books:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkCategoryBooks().then(() => {
  console.log('🎉 Check completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
