const { User, Student, Teacher } = require('../models');

async function listUsers() {
  const users = await User.findAll();
  console.log('=== ACCOUNTS IN DATABASE ===');
  for (const u of users) {
    console.log(`Role: ${u.role.padEnd(12)} | Username/ID: ${(u.username || u.userId || u.identifier || u.email).padEnd(20)} | Name: ${u.name.padEnd(25)} | Email: ${u.email}`);
  }
}

listUsers().then(() => process.exit(0));
