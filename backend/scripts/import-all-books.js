const fs = require('fs');
const path = require('path');
const { executeQuery, getConnection } = require('../config/database');

async function importAllBooks() {
  try {
    console.log('🚀 Starting import of all 1000 books...');
    
    // Read the original SQL file
    const sqlFilePath = path.join(__dirname, '../../resources/E-Commerce_Bookstore_Dataset.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Extract all INSERT statements for books
    const insertStatements = sqlContent.split('\n').filter(line => 
      line.trim().startsWith('(') && line.includes('INSERT INTO books') === false
    );
    
    // Get connection
    const connection = await getConnection();
    
    // Clear existing books first
    console.log('🗑️ Clearing existing books...');
    await connection.query('DELETE FROM books');
    
    // Reset auto increment
    await connection.query('ALTER TABLE books AUTO_INCREMENT = 1');
    
    console.log('📚 Importing books...');
    
    // Process books in batches
    const batchSize = 100;
    let imported = 0;
    
    // Find the start of INSERT statements
    const insertStart = sqlContent.indexOf('INSERT INTO books');
    if (insertStart === -1) {
      throw new Error('Could not find INSERT INTO books statement');
    }
    
    // Extract the VALUES part
    const valuesStart = sqlContent.indexOf('VALUES', insertStart);
    const valuesEnd = sqlContent.indexOf(';', valuesStart);
    const valuesSection = sqlContent.substring(valuesStart + 6, valuesEnd).trim();
    
    // Split by '),(' to get individual book records
    const bookRecords = valuesSection.split('),\n(').map((record, index) => {
      if (index === 0) {
        return record.substring(1); // Remove leading (
      } else {
        return record;
      }
    });
    
    // Process each book record
    for (let i = 0; i < bookRecords.length; i += batchSize) {
      const batch = bookRecords.slice(i, i + batchSize);
      
      const insertQuery = `
        INSERT INTO books (id, title, author, \`condition\`, published_year, edition, short_description, availability, category_id, rating, price, isbn, language, created_at) 
        VALUES ${batch.map(record => `(${record})`).join(',\n')}
      `;
      
      try {
        await connection.query(insertQuery);
        imported += batch.length;
        console.log(`✅ Imported ${imported} books...`);
      } catch (error) {
        console.error(`❌ Error importing batch starting at ${i}:`, error.message);
      }
    }
    
    connection.release();
    
    // Verify import
    const countResult = await executeQuery('SELECT COUNT(*) as total FROM books');
    const totalBooks = countResult.data[0].total;
    
    console.log(`🎉 Import completed! Total books in database: ${totalBooks}`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

// Run the import
importAllBooks().then(() => {
  console.log('✅ Import script finished');
  process.exit(0);
}).catch(error => {
  console.error('❌ Import script failed:', error);
  process.exit(1);
});
