import { manager } from './instance-manager';

export async function handleRequest(req: Request): Promise<Response> {
    const hostname = new URL(req.url).hostname;
    
    // Get or create instance for this hostname
    if (!manager.hasInstance(hostname)) {
        await manager.startInstance(hostname);
        // Wait a moment for the instance to start
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Update activity timestamp
    manager.updateActivity(hostname);
    
    // Forward the request to the instance
    const instancePort = manager.getInstancePort(hostname) || 8083;
    const response = await fetch(`http://localhost:${instancePort}${new URL(req.url).pathname}`, {
        method: req.method,
        headers: req.headers,
        body: req.body
    });
    
    return response;
} 