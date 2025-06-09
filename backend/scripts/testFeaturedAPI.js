const { executeQuery } = require('../config/database');

async function testFeaturedAPI() {
  try {
    console.log('🔍 Testing featured books API query...');
    
    const query = `
      SELECT 
        b.id,
        b.title,
        b.author,
        b.condition,
        b.price,
        b.rating,
        b.short_description,
        c.name as category_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.availability = 1 AND b.rating >= 4.0
      ORDER BY b.rating DESC, b.created_at DESC
      LIMIT 20
    `;
    
    const result = await executeQuery(query);
    
    if (result.success) {
      console.log('📚 Featured books (rating >= 4.0):');
      console.table(result.data.map(book => ({
        id: book.id,
        title: book.title.substring(0, 40) + (book.title.length > 40 ? '...' : ''),
        author: book.author,
        category: book.category_name,
        rating: book.rating,
        price: book.price,
        condition: book.condition
      })));
      
      // Count by category
      const categoryCount = result.data.reduce((acc, book) => {
        acc[book.category_name] = (acc[book.category_name] || 0) + 1;
        return acc;
      }, {});
      
      console.log('\n📊 Featured books by category:');
      console.table(categoryCount);
      
    } else {
      console.error('❌ Failed to fetch featured books:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testFeaturedAPI().then(() => {
  console.log('🎉 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
