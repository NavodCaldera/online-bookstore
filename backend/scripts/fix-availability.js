const { executeQuery } = require('../config/database');

async function fixAvailability() {
  try {
    console.log('🔧 Fixing book availability...');
    
    // Update all books to be available
    const updateResult = await executeQuery('UPDATE books SET availability = 1 WHERE availability = 0');
    
    if (updateResult.success) {
      console.log(`✅ Updated ${updateResult.data.affectedRows} books to be available`);
    }
    
    // Verify the fix
    const countResult = await executeQuery('SELECT COUNT(*) as total FROM books WHERE availability = 1');
    console.log(`📚 Total available books now: ${countResult.data[0].total}`);
    
    const unavailableResult = await executeQuery('SELECT COUNT(*) as total FROM books WHERE availability = 0');
    console.log(`❌ Unavailable books remaining: ${unavailableResult.data[0].total}`);
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
}

fixAvailability().then(() => {
  console.log('✅ Availability fix completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Fix failed:', error);
  process.exit(1);
});
