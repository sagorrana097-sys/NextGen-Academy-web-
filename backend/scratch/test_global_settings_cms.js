const http = require('http');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(JSON.stringify(postData));
    req.end();
  });
}

async function testSettingsFlow() {
  console.log('--- 1. Testing GET http://localhost:5000/api/settings ---');
  return new Promise((resolve, reject) => {
    http.get('http://localhost:5000/api/settings', (res) => {
      let d = '';
      res.on('data', (chunk) => (d += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(d);
          console.log('GET Status:', res.statusCode);
          console.log('Academy Name:', json.data?.academyName);
          console.log('Founder Name:', json.data?.founderName);
          console.log('Contact Number:', json.data?.contactNumber);
          console.log('Classes:', json.data?.academic?.classes);
          console.log('Sections:', json.data?.academic?.sections);
          console.log('Groups:', json.data?.academic?.groups);
          console.log('Subjects:', json.data?.academic?.subjects);
          console.log('Payment Config:', json.data?.payment);

          if (
            json.data?.academyName &&
            json.data?.founderName &&
            Array.isArray(json.data?.academic?.classes) &&
            Array.isArray(json.data?.academic?.sections) &&
            Array.isArray(json.data?.academic?.groups) &&
            Array.isArray(json.data?.academic?.subjects) &&
            json.data?.payment?.bkashCharge !== undefined
          ) {
            console.log('\n>>> SUCCESS: ALL CMS & GLOBAL SETTINGS DATA VERIFIED PERFECTLY! <<<');
            resolve();
          } else {
            console.error('FAILED: Incomplete data shape');
            process.exit(1);
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

testSettingsFlow().catch((err) => {
  console.error('Error during test:', err);
  process.exit(1);
});
