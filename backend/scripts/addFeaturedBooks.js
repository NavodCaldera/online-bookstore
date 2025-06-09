const { executeQuery } = require('../config/database');

async function addFeaturedBooks() {
  try {
    console.log('📚 Adding featured books for Reference, Technology, and History categories...');
    
    // Get category IDs
    const categoriesResult = await executeQuery('SELECT id, name FROM categories WHERE name IN ("Reference", "Technology", "History")');
    
    if (!categoriesResult.success) {
      throw new Error('Failed to fetch categories');
    }
    
    const categories = categoriesResult.data.reduce((acc, cat) => {
      acc[cat.name] = cat.id;
      return acc;
    }, {});
    
    console.log('📋 Categories found:', categories);
    
    // Featured books to add
    const featuredBooks = [
      // Reference Books
      {
        title: 'Oxford English Dictionary - Complete Edition',
        author: 'Oxford University Press',
        category_id: categories['Reference'],
        price: 2500,
        condition: 'New',
        rating: 4.9,
        short_description: 'The definitive record of the English language with comprehensive definitions and etymology.',
        published_year: 2023,
        edition: '3rd Edition',
        isbn: '978-0198611868',
        language: 'English',
        availability: 1
      },
      {
        title: 'Encyclopedia Britannica - Student Edition',
        author: 'Britannica Editorial',
        category_id: categories['Reference'],
        price: 1800,
        condition: 'Used',
        rating: 4.7,
        short_description: 'Comprehensive encyclopedia covering all major fields of knowledge for students.',
        published_year: 2022,
        edition: '15th Edition',
        isbn: '978-1593398378',
        language: 'English',
        availability: 1
      },
      {
        title: 'Merriam-Webster Collegiate Dictionary',
        author: 'Merriam-Webster Inc.',
        category_id: categories['Reference'],
        price: 950,
        condition: 'New',
        rating: 4.6,
        short_description: 'America\'s best-selling dictionary with over 225,000 definitions.',
        published_year: 2023,
        edition: '12th Edition',
        isbn: '978-0877798095',
        language: 'English',
        availability: 1
      },
      
      // Technology Books
      {
        title: 'Introduction to Algorithms - 4th Edition',
        author: 'Thomas H. Cormen',
        category_id: categories['Technology'],
        price: 3200,
        condition: 'New',
        rating: 4.8,
        short_description: 'Comprehensive introduction to algorithms and data structures for computer science students.',
        published_year: 2022,
        edition: '4th Edition',
        isbn: '978-0262046305',
        language: 'English',
        availability: 1
      },
      {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        category_id: categories['Technology'],
        price: 2100,
        condition: 'Used',
        rating: 4.7,
        short_description: 'Essential guide to writing clean, maintainable code for software developers.',
        published_year: 2021,
        edition: '2nd Edition',
        isbn: '978-0132350884',
        language: 'English',
        availability: 1
      },
      {
        title: 'Artificial Intelligence: A Modern Approach',
        author: 'Stuart Russell',
        category_id: categories['Technology'],
        price: 2800,
        condition: 'New',
        rating: 4.9,
        short_description: 'Comprehensive textbook on artificial intelligence concepts and applications.',
        published_year: 2023,
        edition: '4th Edition',
        isbn: '978-0134610993',
        language: 'English',
        availability: 1
      },
      
      // History Books
      {
        title: 'A People\'s History of the World',
        author: 'Chris Harman',
        category_id: categories['History'],
        price: 1650,
        condition: 'Used',
        rating: 4.6,
        short_description: 'Comprehensive history from the perspective of ordinary people throughout the ages.',
        published_year: 2022,
        edition: '2nd Edition',
        isbn: '978-1844672394',
        language: 'English',
        availability: 1
      },
      {
        title: 'The History of Sri Lanka',
        author: 'K.M. de Silva',
        category_id: categories['History'],
        price: 1200,
        condition: 'New',
        rating: 4.5,
        short_description: 'Definitive history of Sri Lanka from ancient times to the modern era.',
        published_year: 2023,
        edition: '3rd Edition',
        isbn: '978-9555580991',
        language: 'English',
        availability: 1
      },
      {
        title: 'World History: Patterns of Interaction',
        author: 'Roger B. Beck',
        category_id: categories['History'],
        price: 2200,
        condition: 'New',
        rating: 4.7,
        short_description: 'Comprehensive world history textbook covering major civilizations and events.',
        published_year: 2022,
        edition: '1st Edition',
        isbn: '978-0547491127',
        language: 'English',
        availability: 1
      }
    ];
    
    // Insert books
    for (const book of featuredBooks) {
      const result = await executeQuery(`
        INSERT INTO books (
          title, author, category_id, price, condition, rating, 
          short_description, published_year, edition, isbn, language, availability
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        book.title, book.author, book.category_id, book.price, book.condition,
        book.rating, book.short_description, book.published_year, book.edition,
        book.isbn, book.language, book.availability
      ]);
      
      if (result.success) {
        console.log(`✅ Added: ${book.title}`);
      } else {
        console.error(`❌ Failed to add: ${book.title}`, result.error);
      }
    }
    
    console.log('\n🎉 Featured books added successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

addFeaturedBooks().then(() => {
  console.log('🎉 Script completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
