const fs = require('fs');
const path = require('path');
const { getConnection } = require('../config/database');

async function importBooksDirectly() {
  try {
    console.log('🚀 Importing all books using direct SQL execution...');
    
    const connection = await getConnection();
    
    // Clear existing books
    console.log('🗑️ Clearing existing books...');
    await connection.query('DELETE FROM books');
    await connection.query('ALTER TABLE books AUTO_INCREMENT = 1');
    
    // Read the original SQL file
    const sqlFilePath = path.join(__dirname, '../../resources/E-Commerce_Bookstore_Dataset.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the entire SQL content
    console.log('📚 Executing complete SQL file...');
    
    // Split by semicolon and execute each statement
    const statements = sqlContent.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      const trimmedStatement = statement.trim();
      if (trimmedStatement && trimmedStatement.includes('INSERT INTO books')) {
        try {
          await connection.query(trimmedStatement);
          console.log('✅ Executed INSERT statement');
        } catch (error) {
          console.log(`⚠️ Skipped statement: ${error.message.substring(0, 100)}...`);
        }
      }
    }
    
    // Check final count
    const [countResult] = await connection.query('SELECT COUNT(*) as total FROM books');
    const [maxIdResult] = await connection.query('SELECT MAX(id) as max_id FROM books');
    
    console.log(`🎉 Import completed!`);
    console.log(`📚 Total books: ${countResult.total}`);
    console.log(`🔢 Highest ID: ${maxIdResult.max_id}`);
    
    // Show sample
    const [sampleBooks] = await connection.query('SELECT id, title, author FROM books ORDER BY id DESC LIMIT 5');
    console.log('📖 Last 5 books imported:');
    sampleBooks.forEach(book => {
      console.log(`  ${book.id}: ${book.title} by ${book.author}`);
    });
    
    connection.release();
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

importBooksDirectly().then(() => {
  console.log('✅ Import completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Import failed:', error);
  process.exit(1);
});
