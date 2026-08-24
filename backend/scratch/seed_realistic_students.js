const bcrypt = require('bcryptjs');
const { User, Student, Class, Section, GuardianStudentMapping } = require('../models');

async function seedRealisticStudents() {
  console.log('🌱 Seeding realistic students across statuses (active, suspended, inactive, left)...');

  const studentsToSeed = [
    {
      name: 'সাদিয়া ইসলাম (Sadia Islam)',
      email: 'sadia.islam@nextgen.edu.bd',
      username: 'NGA-26-4822',
      phone: '01722334455',
      rollNo: 2,
      classId: 12, // Class 9
      sectionId: 34,
      bloodGroup: 'A+',
      status: 'active',
      guardianName: 'মো: রফিকুল ইসলাম',
      guardianPhone: '01711998877'
    },
    {
      name: 'তানভীর আহমেদ (Tanvir Ahmed)',
      email: 'tanvir.ahmed@nextgen.edu.bd',
      username: 'NGA-26-4823',
      phone: '01733445566',
      rollNo: 3,
      classId: 13, // Class 10
      sectionId: 37,
      bloodGroup: 'B+',
      status: 'active',
      guardianName: 'মো: ফারুক আহমেদ',
      guardianPhone: '01811223344'
    },
    {
      name: 'নুসরাত জাহান (Nusrat Jahan)',
      email: 'nusrat.jahan@nextgen.edu.bd',
      username: 'NGA-26-4824',
      phone: '01744556677',
      rollNo: 4,
      classId: 11, // Class 8
      sectionId: 31,
      bloodGroup: 'O+',
      status: 'active',
      guardianName: 'শামসুন্নাহার বেগম',
      guardianPhone: '01911334455'
    },
    {
      name: 'মাহমুদুল হাসান (Mahmudul Hasan)',
      email: 'mahmudul.hasan@nextgen.edu.bd',
      username: 'NGA-26-4825',
      phone: '01755667788',
      rollNo: 5,
      classId: 12, // Class 9
      sectionId: 34,
      bloodGroup: 'AB+',
      status: 'suspended',
      guardianName: 'মো: আব্দুল মালেক',
      guardianPhone: '01711445566'
    },
    {
      name: 'ফারজানা আক্তার (Farzana Akter)',
      email: 'farzana.akter@nextgen.edu.bd',
      username: 'NGA-26-4826',
      phone: '01766778899',
      rollNo: 6,
      classId: 10, // Class 7
      sectionId: 28,
      bloodGroup: 'O-',
      status: 'inactive',
      guardianName: 'মো: কামরুল হাসান',
      guardianPhone: '01611556677'
    }
  ];

  const defaultPasswordHash = await bcrypt.hash('student123', 10);
  const guardianPasswordHash = await bcrypt.hash('parent123', 10);

  for (const st of studentsToSeed) {
    const existing = await User.findOne({ where: { email: st.email } });
    if (!existing) {
      const u = await User.create({
        name: st.name,
        email: st.email,
        username: st.username,
        phone: st.phone,
        role: 'STUDENT',
        isActive: st.status === 'active',
        passwordHash: defaultPasswordHash
      });

      const s = await Student.create({
        userId: u.id,
        studentIdNumber: st.username,
        rollNo: st.rollNo,
        classId: st.classId,
        sectionId: st.sectionId,
        bloodGroup: st.bloodGroup,
        status: st.status,
        admissionDate: '2026-01-05'
      });

      // Guardian
      const gUser = await User.create({
        name: `${st.name}-এর অভিভাবক`,
        email: `parent_${st.username.toLowerCase()}@nextgen.edu.bd`,
        username: `parent_${st.username.toLowerCase()}`,
        phone: st.guardianPhone,
        role: 'PARENT',
        isActive: true,
        passwordHash: guardianPasswordHash
      });

      await GuardianStudentMapping.create({
        studentId: s.id,
        parentId: gUser.id,
        relationship: 'PARENT',
        isPrimary: true
      });

      console.log(`✅ Seeded student: ${st.name} (${st.status})`);
    } else {
      // Ensure status is set
      const sRec = await Student.findOne({ where: { userId: existing.id } });
      if (sRec) {
        await Student.update({ status: st.status }, { where: { id: sRec.id } });
        console.log(`🔄 Updated student status: ${st.name} -> ${st.status}`);
      }
    }
  }

  // Also ensure student 1 has status 'active'
  const student1 = await Student.findByPk(1);
  if (student1 && !student1.status) {
    await Student.update({ status: 'active' }, { where: { id: 1 } });
    console.log('🔄 Updated Student #1 to active');
  }

  console.log('🎉 Realistic students seeded successfully!');
}

seedRealisticStudents().then(() => process.exit(0));
