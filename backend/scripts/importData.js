const { executeQuery } = require('../config/database');
const fs = require('fs');
const path = require('path');

// Function to parse SQL file and import all books
async function importBooksData() {
  try {
    console.log('🔄 Starting full database import...');

    // First, clear existing books (keep only the first 10 sample books)
    await executeQuery('DELETE FROM books WHERE id > 10');
    console.log('✅ Cleared existing imported books');

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '../../resources/E-Commerce_Bookstore_Dataset.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    console.log('📖 Read SQL file successfully');

    // Parse the SQL content to extract book data
    const books = parseBooksFromSQL(sqlContent);
    console.log(`📊 Found ${books.length} books in SQL file`);

    // Import all books from the parsed data
    console.log(`🔄 Importing ${books.length} books...`);

    // Insert books in batches for better performance
    let imported = 0;
    for (const book of books) {
      try {
        await executeQuery(
          `INSERT OR REPLACE INTO books (id, title, author, condition, published_year, edition, short_description, availability, category_id, rating, price, isbn, language, seller_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          book
        );
        imported++;
        if (imported % 100 === 0) {
          console.log(`📚 Imported ${imported}/${books.length} books...`);
        }
      } catch (error) {
        console.error(`Error inserting book ${book[1]}:`, error);
      }
    }

    console.log('✅ Books data imported successfully');

    // Verify the import
    const countResult = await executeQuery('SELECT COUNT(*) as count FROM books');
    if (countResult.success) {
      console.log(`📊 Total books in database: ${countResult.data[0].count}`);
    }

    // Show available books
    const availableResult = await executeQuery('SELECT COUNT(*) as count FROM books WHERE availability = 1');
    if (availableResult.success) {
      console.log(`📚 Available books: ${availableResult.data[0].count}`);
    }

  } catch (error) {
    console.error('❌ Error importing data:', error);
  }
}

// Function to parse books from SQL file
function parseBooksFromSQL(sqlContent) {
  const books = [];

  // Find all INSERT INTO books statements
  const insertRegex = /INSERT INTO books \([^)]+\) VALUES\s*([\s\S]*?)(?=INSERT INTO books|$)/gi;
  let match;

  while ((match = insertRegex.exec(sqlContent)) !== null) {
    const valuesSection = match[1];

    // Parse individual book records
    const bookRecords = parseBookRecords(valuesSection);
    books.push(...bookRecords);
  }

  return books;
}

// Function to parse individual book records from VALUES section
function parseBookRecords(valuesSection) {
  const books = [];

  // Split by lines and process each book record
  const lines = valuesSection.split('\n');
  let currentRecord = '';

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('--')) continue;

    currentRecord += ' ' + trimmedLine;

    // Check if this line ends a record (ends with '),')
    if (trimmedLine.endsWith('),') || trimmedLine.endsWith(');')) {
      const book = parseBookRecord(currentRecord);
      if (book) {
        books.push(book);
      }
      currentRecord = '';
    }
  }

  return books;
}

// Function to parse a single book record
function parseBookRecord(recordString) {
  try {
    // Extract the values between parentheses
    const match = recordString.match(/\(([^)]+)\)/);
    if (!match) return null;

    const valuesString = match[1];

    // Parse the values (this is a simplified parser)
    const values = parseValues(valuesString);
    if (values.length < 13) return null;

    // Convert to our format: [id, title, author, condition, published_year, edition, short_description, availability, category_id, rating, price, isbn, language, seller_id]
    const book = [
      parseInt(values[0]), // id
      values[1], // title
      values[2], // author
      values[3], // condition
      parseInt(values[4]) || null, // published_year
      values[5], // edition
      values[6], // short_description
      parseInt(values[7]) || 1, // availability
      parseInt(values[8]) || 1, // category_id
      parseFloat(values[9]) || 0.0, // rating
      parseFloat(values[10]) * 50, // price (convert USD to LKR)
      values[11], // isbn
      values[12] || 'English', // language
      1 // seller_id (default to 1)
    ];

    return book;
  } catch (error) {
    console.error('Error parsing book record:', error);
    return null;
  }
}

// Function to parse comma-separated values with proper quote handling
function parseValues(valuesString) {
  const values = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < valuesString.length; i++) {
    const char = valuesString[i];

    if (!inQuotes && (char === "'" || char === '"')) {
      inQuotes = true;
      quoteChar = char;
    } else if (inQuotes && char === quoteChar) {
      // Check if it's an escaped quote
      if (i + 1 < valuesString.length && valuesString[i + 1] === quoteChar) {
        current += char;
        i++; // Skip the next quote
      } else {
        inQuotes = false;
        quoteChar = '';
      }
    } else if (!inQuotes && char === ',') {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add the last value
  if (current.trim()) {
    values.push(current.trim());
  }

  // Clean up the values (remove quotes)
  return values.map(value => {
    const trimmed = value.trim();
    if ((trimmed.startsWith("'") && trimmed.endsWith("'")) ||
        (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
      return trimmed.slice(1, -1);
    }
    return trimmed;
  });
}

// Run the import if this script is executed directly
if (require.main === module) {
  importBooksData().then(() => {
    console.log('🎉 Data import completed');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Data import failed:', error);
    process.exit(1);
  });
}

module.exports = { importBooksData };
