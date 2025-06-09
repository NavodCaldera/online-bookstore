const { executeQuery } = require('../config/database');

async function checkTechBooks() {
  try {
    console.log('🔍 Checking Technology books...');
    
    const result = await executeQuery(`
      SELECT b.*, c.name as category_name 
      FROM books b 
      JOIN categories c ON b.category_id = c.id 
      WHERE c.name = 'Technology'
      ORDER BY b.rating DESC
    `);
    
    if (result.success) {
      console.log('📚 Technology books found:');
      console.table(result.data.map(book => ({
        id: book.id,
        title: book.title.substring(0, 40),
        author: book.author,
        rating: book.rating,
        availability: book.availability,
        condition: book.condition
      })));
      
      // Check if any meet featured criteria (rating >= 4.0 and available)
      const featuredEligible = result.data.filter(book => book.rating >= 4.0 && book.availability === 1);
      console.log(`\n✅ Technology books eligible for featured: ${featuredEligible.length}`);
      
      if (featuredEligible.length > 0) {
        console.log('📖 Featured-eligible Technology books:');
        featuredEligible.forEach(book => {
          console.log(`  - ${book.title} (Rating: ${book.rating}, Available: ${book.availability})`);
        });
      }
      
    } else {
      console.error('❌ Failed to fetch Technology books:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkTechBooks().then(() => {
  console.log('🎉 Check completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
