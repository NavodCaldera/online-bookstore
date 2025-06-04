const fs = require('fs');
const path = require('path');
const { getConnection } = require('../config/database');

async function loadAllBooks() {
  try {
    console.log('🚀 Loading all 1000 books from original dataset...');
    
    const connection = await getConnection();
    
    // First, clear existing books
    console.log('🗑️ Clearing existing books...');
    await connection.query('DELETE FROM books WHERE id > 0');
    await connection.query('ALTER TABLE books AUTO_INCREMENT = 1');
    
    // Read the original SQL file
    const sqlFilePath = path.join(__dirname, '../../resources/E-Commerce_Bookstore_Dataset.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split into lines and find INSERT statements
    const lines = sqlContent.split('\n');
    let currentInsert = '';
    let inInsertBlock = false;
    
    for (const line of lines) {
      if (line.includes('INSERT INTO books')) {
        inInsertBlock = true;
        currentInsert = line;
      } else if (inInsertBlock) {
        currentInsert += '\n' + line;
        
        // Check if this line ends the INSERT statement
        if (line.trim().endsWith(';')) {
          try {
            console.log('📚 Executing INSERT statement...');
            await connection.query(currentInsert);
            console.log('✅ Books inserted successfully');
          } catch (error) {
            console.error('❌ Error inserting books:', error.message);
          }
          
          currentInsert = '';
          inInsertBlock = false;
        }
      }
    }
    
    // Verify the import
    const [countResult] = await connection.query('SELECT COUNT(*) as total FROM books');
    console.log(`🎉 Total books in database: ${countResult.total}`);
    
    // Show some sample books
    const [sampleBooks] = await connection.query('SELECT id, title, author FROM books LIMIT 5');
    console.log('📖 Sample books:');
    sampleBooks.forEach(book => {
      console.log(`  ${book.id}: ${book.title} by ${book.author}`);
    });
    
    connection.release();
    
  } catch (error) {
    console.error('❌ Failed to load books:', error);
  }
}

// Run the script
if (require.main === module) {
  loadAllBooks().then(() => {
    console.log('✅ Script completed');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

module.exports = { loadAllBooks };
