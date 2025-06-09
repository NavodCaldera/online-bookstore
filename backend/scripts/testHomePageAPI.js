const { executeQuery } = require('../config/database');

async function testHomePageAPI() {
  try {
    console.log('🔍 Testing home page API data...');
    
    // Same query as the featured books API
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
      console.log('📚 First 20 featured books:');
      console.table(result.data.map(book => ({
        id: book.id,
        title: book.title.substring(0, 30) + (book.title.length > 30 ? '...' : ''),
        author: book.author.substring(0, 20) + (book.author.length > 20 ? '...' : ''),
        category: book.category_name,
        rating: book.rating,
        price: book.price
      })));
      
      // Check specific categories
      const categories = result.data.map(book => book.category_name);
      const uniqueCategories = [...new Set(categories)];
      
      console.log('\n📊 Categories in first 20 books:');
      console.log(uniqueCategories);
      
      // Check if our target categories are present
      const targetCategories = ['Reference', 'Technology', 'History'];
      const foundCategories = targetCategories.filter(cat => uniqueCategories.includes(cat));
      const missingCategories = targetCategories.filter(cat => !uniqueCategories.includes(cat));
      
      console.log('\n✅ Found target categories:', foundCategories);
      console.log('❌ Missing target categories:', missingCategories);
      
      // Show books from target categories
      targetCategories.forEach(category => {
        const booksInCategory = result.data.filter(book => book.category_name === category);
        if (booksInCategory.length > 0) {
          console.log(`\n📖 ${category} books:`);
          booksInCategory.forEach(book => {
            console.log(`  - ${book.title} by ${book.author} (Rating: ${book.rating})`);
          });
        }
      });
      
    } else {
      console.error('❌ Failed to fetch books:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testHomePageAPI().then(() => {
  console.log('🎉 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
