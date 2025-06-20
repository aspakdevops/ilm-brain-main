/**
 * Simple test script for Goal Details API
 * Run this to test the API endpoints
 */

const http = require('http');

function testAPI(path, description) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    console.log(`\n✅ ${description}`);
                    console.log(`📍 GET ${path}`);
                    console.log(`📊 Status: ${res.statusCode}`);
                    console.log(`📄 Response:`, JSON.stringify(jsonData, null, 2));
                    resolve(jsonData);
                } catch (error) {
                    console.log(`\n❌ ${description} - Parse Error`);
                    console.log(`📍 GET ${path}`);
                    console.log(`📊 Status: ${res.statusCode}`);
                    console.log(`📄 Raw Response:`, data);
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.log(`\n❌ ${description} - Connection Error`);
            console.log(`📍 GET ${path}`);
            console.log(`🔥 Error:`, error.message);
            reject(error);
        });

        req.end();
    });
}

async function runTests() {
    console.log('🚀 Testing Goal Details API...');
    console.log('⚠️  Make sure your server is running on port 3000');
    
    try {
        // Test valid goal ID 1
        await testAPI('/api/content/goals/1?subject=physics', 'Goal ID 1 (First Goal)');
        
        // Test valid goal ID 44 (from your example)
        await testAPI('/api/content/goals/44?subject=physics', 'Goal ID 44 (Renewable Energy)');
        
        // Test invalid goal ID
        await testAPI('/api/content/goals/999?subject=physics', 'Invalid Goal ID 999');
        
        // Test invalid subject
        await testAPI('/api/content/goals/1?subject=chemistry', 'Invalid Subject');
        
        // Test non-numeric goal ID
        await testAPI('/api/content/goals/abc?subject=physics', 'Non-numeric Goal ID');
        
    } catch (error) {
        console.log('\n🔥 Test failed:', error.message);
    }
    
    console.log('\n🏁 API Tests Complete!');
    console.log('\n💡 To start your server: npm start');
    console.log('💡 To test in browser: http://localhost:3000/learning?topic=1&subtopic=1&subject=physics');
}

runTests(); 