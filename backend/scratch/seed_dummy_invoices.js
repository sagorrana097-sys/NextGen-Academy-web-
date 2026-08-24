const { Invoice, Payment, Student } = require('../models');

async function seedDummyInvoices() {
  console.log('Seeding dummy invoices for Student #1 into database...');

  const student = await Student.findByPk(1);
  if (!student) {
    console.error('Student #1 not found');
    return;
  }

  // Check if invoices exist
  const existingInvoices = await Invoice.findAll({ where: { studentId: 1 } });
  console.log(`Current invoices for Student #1: ${existingInvoices.length}`);

  // Create Invoice 1: Unpaid
  // { invoiceId: 'INV-2608-01', description: 'আগস্ট ২০২৬ - মাসিক বেতন', baseAmount: 1500, discount: 0, payable: 1500, dueDate: '2026-08-10', status: 'Unpaid' }
  const inv1 = await Invoice.create({
    id: 101,
    studentId: 1,
    invoiceNo: 'INV-2608-01',
    invoiceId: 'INV-2608-01',
    titleBn: 'আগস্ট ২০২৬ - মাসিক বেতন',
    titleEn: 'August 2026 - Monthly Tuition Fee',
    description: 'আগস্ট ২০২৬ - মাসিক বেতন',
    month: 'আগস্ট',
    year: '২০২৬',
    baseAmount: 1500,
    discount: 0,
    discountAmount: 0,
    discountType: 'NONE',
    discountReason: null,
    amount: 1500,
    payable: 1500,
    dueDate: '2026-08-10',
    status: 'UNPAID',
    createdAt: '2026-08-01T00:00:00.000Z'
  });
  console.log('✅ Created Dummy Invoice 1:', inv1.invoiceNo, `(${inv1.status})`);

  // Create Invoice 2: Paid
  // { invoiceId: 'INV-2607-05', description: 'জুলাই ২০২৬ - মাসিক বেতন', baseAmount: 1500, discount: 200, payable: 1300, dueDate: '2026-07-10', status: 'Paid' }
  const inv2 = await Invoice.create({
    id: 102,
    studentId: 1,
    invoiceNo: 'INV-2607-05',
    invoiceId: 'INV-2607-05',
    titleBn: 'জুলাই ২০২৬ - মাসিক বেতন',
    titleEn: 'July 2026 - Monthly Tuition Fee',
    description: 'জুলাই ২০২৬ - মাসিক বেতন',
    month: 'জুলাই',
    year: '২০২৬',
    baseAmount: 1500,
    discount: 200,
    discountAmount: 200,
    discountType: 'FIXED',
    discountReason: 'MERIT_SCHOLARSHIP',
    amount: 1300,
    payable: 1300,
    dueDate: '2026-07-10',
    status: 'PAID',
    createdAt: '2026-07-01T00:00:00.000Z'
  });

  await Payment.create({
    id: 102,
    invoiceId: inv2.id,
    studentId: 1,
    amount: 1300,
    method: 'BKASH',
    transactionId: 'BKASH-TXN-88741',
    status: 'COMPLETED',
    paidAt: '2026-07-08T10:30:00.000Z'
  });
  console.log('✅ Created Dummy Invoice 2:', inv2.invoiceNo, `(${inv2.status}) with Payment`);

  console.log('🎉 Dummy invoice seeding complete!');
}

seedDummyInvoices().then(() => process.exit(0));
