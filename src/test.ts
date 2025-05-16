import { manager } from './instance-manager';

async function test() {
    console.log('Starting test...');
    
    try {
        // Test 1: Start first instance
        console.log('\nTest 1: Starting first instance for test1.local...');
        const port1 = await manager.startInstance('test1.local');
        console.log(`Instance started on port ${port1}`);
        
        // Test 2: Try to start second instance (should fail)
        console.log('\nTest 2: Attempting to start second instance for test2.local...');
        try {
            await manager.startInstance('test2.local');
            console.error('❌ Test failed: Second instance was allowed to start');
        } catch (error) {
            console.log('✅ Test passed: Second instance correctly prevented from starting');
        }
        
        // Test 3: Verify instance is still running
        console.log('\nTest 3: Verifying instance is still running...');
        if (manager.hasInstance('test1.local')) {
            console.log('✅ Test passed: Instance is still running');
        } else {
            console.error('❌ Test failed: Instance is not running');
        }
        
        // Test 4: Update activity to prevent timeout
        console.log('\nTest 4: Updating activity to prevent timeout...');
        manager.updateActivity('test1.local');
        console.log('Activity updated');
        
        // Test 5: Wait for 2 seconds and verify instance is still running
        console.log('\nTest 5: Waiting 2 seconds and verifying instance is still running...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (manager.hasInstance('test1.local')) {
            console.log('✅ Test passed: Instance is still running after 2 seconds');
        } else {
            console.error('❌ Test failed: Instance was killed too early');
        }
        
        // Test 6: Wait for idle timeout
        console.log('\nTest 6: Waiting for idle timeout (5 seconds)...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        if (!manager.hasInstance('test1.local')) {
            console.log('✅ Test passed: Instance was correctly killed after idle timeout');
        } else {
            console.error('❌ Test failed: Instance was not killed after idle timeout');
        }
        
    } catch (error) {
        console.error('Test failed with error:', error);
    }
    
    console.log('\nTest complete!');
}

test().catch(console.error); 