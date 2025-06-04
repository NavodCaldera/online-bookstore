const { executeQuery } = require('../config/database');

async function checkBooks() {
  try {
    console.log('🔍 Checking books in database...');
    
    // Get total count
    const countResult = await executeQuery('SELECT COUNT(*) as total FROM books');
    console.log('Count result:', countResult);
    
    if (countResult.success) {
      console.log(`📚 Total books: ${countResult.data[0].total}`);
    }
    
    // Get max ID
    const maxIdResult = await executeQuery('SELECT MAX(id) as max_id FROM books');
    if (maxIdResult.success) {
      console.log(`🔢 Highest book ID: ${maxIdResult.data[0].max_id}`);
    }
    
    // Get sample books
    const sampleResult = await executeQuery('SELECT id, title, author FROM books ORDER BY id LIMIT 10');
    if (sampleResult.success) {
      console.log('📖 First 10 books:');
      sampleResult.data.forEach(book => {
        console.log(`  ${book.id}: ${book.title} by ${book.author}`);
      });
    }
    
    // Get last few books
    const lastResult = await executeQuery('SELECT id, title, author FROM books ORDER BY id DESC LIMIT 5');
    if (lastResult.success) {
      console.log('📖 Last 5 books:');
      lastResult.data.forEach(book => {
        console.log(`  ${book.id}: ${book.title} by ${book.author}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking books:', error);
  }
}

checkBooks().then(() => {
  console.log('✅ Check completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Check failed:', error);
  process.exit(1);
});
