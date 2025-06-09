const { executeQuery } = require('../config/database');

async function checkUsers() {
  try {
    console.log('🔍 Checking users in database...');
    
    const result = await executeQuery('SELECT id, full_name, email, user_type FROM users');
    
    if (result.success) {
      console.log('📊 Users found:');
      console.table(result.data);
      
      // Update user to be both buyer and seller for testing
      if (result.data.length > 0) {
        const userId = result.data[0].id;
        console.log(`\n🔄 Updating user ${userId} to be both buyer and seller...`);
        
        const updateResult = await executeQuery(
          'UPDATE users SET user_type = ? WHERE id = ?',
          ['both', userId]
        );
        
        if (updateResult.success) {
          console.log('✅ User updated successfully');
          
          // Verify the update
          const verifyResult = await executeQuery('SELECT id, full_name, email, user_type FROM users WHERE id = ?', [userId]);
          if (verifyResult.success) {
            console.log('📋 Updated user:');
            console.table(verifyResult.data);
          }
        } else {
          console.error('❌ Failed to update user:', updateResult.error);
        }
      }
    } else {
      console.error('❌ Failed to fetch users:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkUsers().then(() => {
  console.log('🎉 Check completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
