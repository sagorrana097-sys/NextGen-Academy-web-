const { Student, User } = require('../models');

async function inspectStudents() {
  const students = await Student.findAll({
    include: [{ model: User, as: 'user' }]
  });
  console.log('Total students:', students.length);
  students.forEach((s) => {
    console.log(`ID: ${s.id} | Roll: ${s.rollNo} | Name: ${s.user?.name} | Status: ${s.status} | User Active: ${s.user?.isActive}`);
  });
}

inspectStudents().then(() => process.exit(0));
