const { executeQuery } = require('../config/database');

async function createDefaultUser() {
  try {
    console.log('🔧 Creating default user for book listings...');
    
    // Check if default user already exists
    const checkResult = await executeQuery('SELECT id FROM users WHERE id = 1');
    
    if (checkResult.success && checkResult.data.length > 0) {
      console.log('✅ Default user already exists with ID 1');
      return;
    }
    
    // Create default user
    const insertResult = await executeQuery(`
      INSERT INTO users (id, full_name, email, password_hash, phone, user_type, created_at)
      VALUES (1, 'Default Seller', 'default@pageturn.lk', 'temp_password_hash', '+94771234567', 'seller', NOW())
    `);
    
    if (insertResult.success) {
      console.log('✅ Default user created successfully');
      console.log('   ID: 1');
      console.log('   Name: Default Seller');
      console.log('   Email: default@pageturn.lk');
      console.log('   Type: seller');
    } else {
      console.error('❌ Failed to create default user:', insertResult.error);
    }
    
    // Verify creation
    const verifyResult = await executeQuery('SELECT * FROM users WHERE id = 1');
    if (verifyResult.success && verifyResult.data.length > 0) {
      console.log('✅ Verification successful - Default user exists');
    }
    
  } catch (error) {
    console.error('❌ Error creating default user:', error);
  }
}

createDefaultUser().then(() => {
  console.log('✅ Default user setup completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});
