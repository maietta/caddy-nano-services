import { manager } from './instance-manager';

async function test() {
    console.log('Starting test...');
    
    // Start an instance
    console.log('Starting instance for test.local...');
    const port = await manager.startInstance('test.local');
    console.log(`Instance started on port ${port}`);
    
    // Simulate some activity
    console.log('Simulating activity...');
    manager.updateActivity('test.local');
    
    // Wait for 2 seconds
    console.log('Waiting 2 seconds...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update activity again
    console.log('Updating activity again...');
    manager.updateActivity('test.local');
    
    // Wait for 6 seconds to see the instance shut down
    console.log('Waiting 6 seconds to see instance shut down...');
    await new Promise(resolve => setTimeout(resolve, 6000));
    
    console.log('Test complete!');
}

test().catch(console.error); 