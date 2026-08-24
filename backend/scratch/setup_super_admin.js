const bcrypt = require('bcryptjs');
const { User } = require('../models');

async function setupSuperAdmin() {
  console.log('===================================================================');
  console.log('👑 SETTING UP / UPDATING SUPER ADMIN CREDENTIALS');
  console.log('===================================================================\n');

  const username = 'Alomgir005';
  const rawPassword = '01792818005';
  const phone = '01792818005';
  const email = 'admin@nextgen.edu.bd';
  const role = 'SUPER_ADMIN';
  const name = 'Alomgir Hossain';
  const nameBn = 'আলমগীর হোসেন';

  // 1. Hash password with bcrypt
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(rawPassword, salt);

  // 2. Look for existing admin user by username or email
  const allUsers = await User.findAll();
  let existingUser = allUsers.find(
    u =>
      (u.username && u.username.toLowerCase() === username.toLowerCase()) ||
      (u.userId && String(u.userId).toLowerCase() === username.toLowerCase()) ||
      (u.identifier && String(u.identifier).toLowerCase() === username.toLowerCase()) ||
      (u.email && u.email.toLowerCase() === email.toLowerCase()) ||
      (u.phone && u.phone === phone)
  );

  if (existingUser) {
    console.log(`Found existing user (ID: ${existingUser.id}, Username: ${existingUser.username || existingUser.email}). Updating...`);
    await User.update(
      {
        username: username,
        userId: username,
        identifier: username,
        name: name,
        nameBn: nameBn,
        email: email,
        phone: phone,
        password: passwordHash,
        passwordHash: passwordHash,
        role: role,
        isActive: true,
        twoFactorEnabled: false // ensure clean immediate login
      },
      { where: { id: existingUser.id } }
    );
    console.log('✅ Super Admin user updated successfully in database!');
  } else {
    console.log('Creating new Super Admin user...');
    const newUser = await User.create({
      username: username,
      userId: username,
      identifier: username,
      name: name,
      nameBn: nameBn,
      email: email,
      phone: phone,
      password: passwordHash,
      passwordHash: passwordHash,
      role: role,
      isActive: true,
      twoFactorEnabled: false
    });
    console.log(`✅ Super Admin created with ID: ${newUser.id}`);
  }

  // 3. Verify Login Support
  console.log('\n--- VERIFYING CREDENTIALS IN DATABASE ---');
  const userInDb = await User.findOne({ where: { username } });
  console.log('User Record:', {
    id: userInDb.id,
    username: userInDb.username,
    email: userInDb.email,
    phone: userInDb.phone,
    role: userInDb.role,
    isActive: userInDb.isActive
  });

  const isPasswordValid = bcrypt.compareSync(rawPassword, userInDb.password);
  console.log('Password Hash Match for "01792818005":', isPasswordValid ? '✅ VALID' : '❌ INVALID');

  console.log('\n===================================================================');
  console.log('🎉 SUPER ADMIN ACCOUNT IS READY FOR LOGIN:');
  console.log(`   * User ID / Username: ${username}`);
  console.log(`   * Phone Number:       ${phone}`);
  console.log(`   * Email:              ${email}`);
  console.log(`   * Password:           ${rawPassword}`);
  console.log(`   * Role:               ${role}`);
  console.log('===================================================================');
}

setupSuperAdmin().catch(console.error);
