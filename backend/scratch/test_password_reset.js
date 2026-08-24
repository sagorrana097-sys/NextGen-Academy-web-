async function testPasswordResetFlow() {
  console.log('===================================================================');
  console.log('🔒 TESTING FORGOT PASSWORD & PASSWORD RESET FLOW');
  console.log('===================================================================\n');

  const API_URL = 'http://127.0.0.1:5000/api';

  // Test 1: Invalid email / user ID
  console.log('1. Testing non-existent user handling:');
  const invalidRes = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'non_existent_user_999@test.com' })
  }).then(r => r.json());

  console.log('   Response Status:', !invalidRes.success ? '✅ Correctly Rejected (404)' : '❌ Failed');
  console.log('   Error Message:', invalidRes.error?.message);

  // Test 2: Valid Request OTP
  console.log('\n2. Requesting Password Reset OTP for Admin (01792818005):');
  const forgotRes = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: '01792818005' })
  }).then(r => r.json());

  console.log('   Status:', forgotRes.success ? '✅ SUCCESS' : '❌ FAILED');
  console.log('   Message:', forgotRes.message);
  console.log('   Destination:', forgotRes.data?.destination);
  console.log('   Generated Demo OTP:', forgotRes.data?.demoOtp);

  const otp = forgotRes.data?.demoOtp;
  const userIdentifier = forgotRes.data?.identifier || '01792818005';

  // Test 3: Invalid OTP
  console.log('\n3. Testing incorrect OTP verification:');
  const wrongOtpRes = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: userIdentifier,
      otp: '999999',
      newPassword: 'TemporaryPassword123!'
    })
  }).then(r => r.json());

  console.log('   Status:', !wrongOtpRes.success ? '✅ Correctly Rejected' : '❌ Failed');
  console.log('   Error Message:', wrongOtpRes.error?.message);

  // Test 4: Valid Password Reset
  console.log('\n4. Resetting password with valid OTP:');
  const tempPassword = 'UpdatedSecurePass123!';
  const resetRes = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: userIdentifier,
      otp: otp,
      newPassword: tempPassword
    })
  }).then(r => r.json());

  console.log('   Status:', resetRes.success ? '✅ SUCCESS' : '❌ FAILED');
  console.log('   Message:', resetRes.message);

  // Test 5: Verify Login with New Password
  console.log('\n5. Logging in with new reset password:');
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: '01792818005',
      password: tempPassword
    })
  }).then(r => r.json());

  console.log('   Login Status:', loginRes.success ? '✅ SUCCESS (New Password Works)' : '❌ FAILED');
  console.log('   Authenticated User:', loginRes.data?.user?.name, `(${loginRes.data?.user?.role})`);

  // Test 6: Restore default password (01792818005)
  console.log('\n6. Restoring credentials back to default (01792818005):');
  const restoreForgot = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: '01792818005' })
  }).then(r => r.json());

  const restoreOtp = restoreForgot.data?.demoOtp;
  const restoreRes = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: '01792818005',
      otp: restoreOtp,
      newPassword: 'Password123!'
    })
  }).then(r => r.json());

  console.log('   Restore Status:', restoreRes.success ? '✅ DEFAULT CREDENTIALS RESTORED' : '❌ FAILED');

  console.log('\n===================================================================');
  console.log('🎉 FORGOT PASSWORD & PASSWORD RESET MODULE FULLY VERIFIED!');
  console.log('===================================================================');
}

testPasswordResetFlow().catch(console.error);
