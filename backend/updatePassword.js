// Usage: node updatePassword.js <email> <newPassword>
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

async function updatePassword(email, newPassword) {
  if (!email || !newPassword) {
    console.error('Usage: node updatePassword.js <email> <newPassword>');
    process.exit(1);
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.error('User not found');
      process.exit(1);
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    user.passwordHash = passwordHash;
    await user.save();
    console.log('Password updated successfully for', email);
  } catch (err) {
    console.error('Error updating password:', err);
    process.exit(1);
  }
}

const [,, email, newPassword] = process.argv;
updatePassword(email, newPassword);
