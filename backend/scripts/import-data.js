const fs = require('fs');
const path = require('path');
const { executeQuery } = require('../config/database');

async function importData() {
  try {
    console.log('🔄 Starting data import...');

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '../../resources/E-Commerce_Bookstore_Dataset.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    // Extract INSERT statements for books
    const insertStatements = sqlContent
      .split('\n')
      .filter(line => line.trim().startsWith('INSERT INTO books'))
      .join('\n');

    // Convert MySQL INSERT syntax to SQLite compatible format
    const sqliteInserts = insertStatements
      .replace(/INSERT INTO books \(/g, 'INSERT OR REPLACE INTO books (')
      .replace(/`condition`/g, 'condition')
      .replace(/NOW\(\)/g, 'datetime("now")')
      .replace(/\\\'/g, "''"); // Escape single quotes

    // Split into individual INSERT statements
    const statements = sqliteInserts.split(';').filter(stmt => stmt.trim().length > 0);

    console.log(`📚 Found ${statements.length} book records to import`);

    // Execute each statement
    let successCount = 0;
    let errorCount = 0;

    for (const statement of statements) {
      const trimmedStatement = statement.trim();
      if (trimmedStatement) {
        try {
          await executeQuery(trimmedStatement);
          successCount++;
          if (successCount % 50 === 0) {
            console.log(`✅ Imported ${successCount} books...`);
          }
        } catch (error) {
          console.error(`❌ Error importing book: ${error.message}`);
          errorCount++;
        }
      }
    }

    console.log(`✅ Data import completed!`);
    console.log(`📊 Successfully imported: ${successCount} books`);
    if (errorCount > 0) {
      console.log(`⚠️ Errors encountered: ${errorCount}`);
    }

    // Verify the import
    const countResult = await executeQuery('SELECT COUNT(*) as count FROM books');
    if (countResult.success) {
      console.log(`📚 Total books in database: ${countResult.data[0].count}`);
    }

    // Update prices to LKR (1 USD = 50 LKR as per user preference)
    console.log('💰 Converting prices to LKR...');
    const updateResult = await executeQuery('UPDATE books SET price = ROUND(price * 50, 2)');
    if (updateResult.success) {
      console.log('✅ Prices converted to LKR successfully');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

// Run the import
importData();
