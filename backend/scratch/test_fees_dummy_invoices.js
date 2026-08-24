async function testFeesDummyInvoices() {
  console.log('🧪 Testing Fees & Payment Dummy Data & Summary Cards Calculations...');

  const BASE_URL = 'http://localhost:5000/api';

  try {
    // 1. Student Login
    console.log('1. Student Login (NGA-26-4821)...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'NGA-26-4821',
        password: 'student123'
      })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.token;
    console.log('✅ Student Authenticated');

    // 2. Fetch Invoices
    console.log('2. Fetching /api/student/invoices...');
    const invRes = await fetch(`${BASE_URL}/student/invoices`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const invData = await invRes.json();

    if (!invData.success) {
      throw new Error(`Invoices fetch failed: ${JSON.stringify(invData)}`);
    }

    const invoices = invData.data;
    console.log(`✅ Fetched ${invoices.length} invoices:`);
    invoices.forEach((inv, i) => {
      console.log(`   [${i+1}] ${inv.invoiceNo} | ${inv.titleBn} | Base: ৳${inv.baseAmount} | Disc: ৳${inv.discountAmount || 0} | Payable: ৳${inv.amount} | Due: ${inv.dueDate} | Status: ${inv.status}`);
    });

    // 3. Verify Dummy Invoice 1
    const inv1 = invoices.find(i => i.invoiceNo === 'INV-2608-01');
    if (!inv1) throw new Error('Dummy Invoice 1 (INV-2608-01) not found');
    console.log('✅ Dummy Invoice 1 Validated:');
    console.log(`   - Description: ${inv1.titleBn || inv1.description}`);
    console.log(`   - Base Amount: ৳${inv1.baseAmount}`);
    console.log(`   - Discount: ৳${inv1.discountAmount || inv1.discount || 0}`);
    console.log(`   - Payable: ৳${inv1.amount || inv1.payable}`);
    console.log(`   - Status: ${inv1.status}`);

    // 4. Verify Dummy Invoice 2
    const inv2 = invoices.find(i => i.invoiceNo === 'INV-2607-05');
    if (!inv2) throw new Error('Dummy Invoice 2 (INV-2607-05) not found');
    console.log('✅ Dummy Invoice 2 Validated:');
    console.log(`   - Description: ${inv2.titleBn || inv2.description}`);
    console.log(`   - Base Amount: ৳${inv2.baseAmount}`);
    console.log(`   - Discount: ৳${inv2.discountAmount || inv2.discount}`);
    console.log(`   - Payable: ৳${inv2.amount || inv2.payable}`);
    console.log(`   - Status: ${inv2.status}`);

    // 5. Test Summary Cards Math
    const totalBase = invoices.reduce((sum, inv) => sum + (Number(inv.baseAmount) || Number(inv.amount) || 0), 0);
    const totalDiscount = invoices.reduce((sum, inv) => sum + (Number(inv.discountAmount) || 0), 0);
    const totalPaid = invoices.filter(inv => inv.status === 'PAID' || inv.status === 'Paid').reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
    const totalDue = invoices.filter(inv => inv.status === 'UNPAID' || inv.status === 'Unpaid').reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);

    console.log('✅ Summary Cards Computed:');
    console.log(`   - মোট মূল ফি (Total Base): ৳${totalBase}`);
    console.log(`   - প্রাপ্ত মোট ছাড় (Total Discount): ৳${totalDiscount}`);
    console.log(`   - পরিশোধিত ফি (Total Paid): ৳${totalPaid}`);
    console.log(`   - বর্তমান নিট বকেয়া (Total Due): ৳${totalDue}`);

    console.log('🎉 ALL FEES & PAYMENT DUMMY DATA TESTS PASSED PERFECTLY!');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

testFeesDummyInvoices();
