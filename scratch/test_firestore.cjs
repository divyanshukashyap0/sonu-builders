const https = require('https');

const url = 'https://firestore.googleapis.com/v1/projects/sonu-enterprise-80947/databases/(default)/documents/staff';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.documents) {
                console.log(`Found ${json.documents.length} staff members:`);
                json.documents.forEach((doc) => {
                    const fields = doc.fields || {};
                    const fullName = fields.fullName ? fields.fullName.stringValue : 'N/A';
                    const employeeId = fields.employeeId ? fields.employeeId.stringValue : 'N/A';
                    console.log(`- ${fullName} (${employeeId}) - Path: ${doc.name.split('/').pop()}`);
                });
            } else {
                console.log('No documents found in staff collection.');
                console.log(JSON.stringify(json, null, 2));
            }
        } catch (e) {
            console.error('Error parsing response:', e);
            console.log('Raw data:', data);
        }
    });
}).on('error', (err) => {
    console.error('Request error:', err);
});
