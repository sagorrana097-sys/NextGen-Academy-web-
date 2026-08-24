const bcrypt = require('bcryptjs');
const { User, Student, Teacher } = require('../models');

async function ensureAllRoleAccounts() {
  console.log('Ensuring all role accounts have known passwords...');

  // 1. Super Admin: Alomgir005 / 01792818005
  const admin = await User.findOne({ where: { role: 'SUPER_ADMIN' } });
  if (admin) {
    const hash = await bcrypt.hash('01792818005', 10);
    await User.update({ username: 'Alomgir005', passwordHash: hash }, { where: { id: admin.id } });
    console.log('✅ Super Admin: Alomgir005 / 01792818005');
  }

  // 2. Student: NGA-26-4821 / student123
  let studentUser = await User.findOne({ where: { role: 'STUDENT' } });
  if (studentUser) {
    const hash = await bcrypt.hash('student123', 10);
    await User.update({ passwordHash: hash }, { where: { id: studentUser.id } });
    console.log(`✅ Student: ${studentUser.username || studentUser.email} / student123`);
  }

  // 3. Teacher: teacher@nextgen.edu.bd / teacher123
  let teacherUser = await User.findOne({ where: { role: 'TEACHER' } });
  if (!teacherUser) {
    const hash = await bcrypt.hash('teacher123', 10);
    teacherUser = await User.create({
      name: 'মো: রফিকুল ইসলাম (সিনিয়র পদার্থবিজ্ঞান শিক্ষক)',
      email: 'teacher@nextgen.edu.bd',
      username: 'teacher01',
      role: 'TEACHER',
      phone: '01711223344',
      passwordHash: hash
    });
    await Teacher.create({
      userId: teacherUser.id,
      designation: 'সিনিয়র শিক্ষক',
      specialization: 'পদার্থবিজ্ঞান ও উচ্চতর গণিত',
      joiningDate: '2022-01-01'
    });
    console.log('✅ Teacher Created: teacher@nextgen.edu.bd / teacher123');
  } else {
    const hash = await bcrypt.hash('teacher123', 10);
    await User.update({ passwordHash: hash }, { where: { id: teacherUser.id } });
    console.log(`✅ Teacher: ${teacherUser.email} / teacher123`);
  }

  // 4. Parent: parent_nga264821@nextgen.edu.bd / parent123
  let parentUser = await User.findOne({ where: { role: 'PARENT' } });
  if (parentUser) {
    const hash = await bcrypt.hash('parent123', 10);
    await User.update({ passwordHash: hash }, { where: { id: parentUser.id } });
    console.log(`✅ Parent: ${parentUser.email} / parent123`);
  }
}

ensureAllRoleAccounts().then(() => process.exit(0));
