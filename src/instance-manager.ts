import { spawn } from 'child_process';
import { EventEmitter } from 'events';

interface Instance {
    process: any;
    lastActive: number;
    port: number;
}

class UnikernelManager extends EventEmitter {
    private instances: Map<string, Instance> = new Map();
    private readonly IDLE_TIMEOUT = 5000; // 5 seconds
    private readonly PORT = 8083; // Fixed port for all instances

    constructor() {
        super();
        this.startCleanupInterval();
    }

    hasInstance(hostname: string): boolean {
        return this.instances.has(hostname);
    }

    getInstancePort(hostname: string): number {
        return this.PORT;
    }

    async startInstance(hostname: string): Promise<number> {
        // Check if any instance is already running on the port
        if (this.instances.size > 0) {
            throw new Error('An instance is already running on port 8083');
        }

        const instance = spawn('ops', [
            'pkg', 'load', 'eyberg/node:v14.2.0',
            '-p', this.PORT.toString(),
            '-n',
            '-a', 'hi.js'
        ]);

        const newInstance: Instance = {
            process: instance,
            lastActive: Date.now(),
            port: this.PORT
        };

        this.instances.set(hostname, newInstance);
        
        // Handle instance output
        instance.stdout.on('data', (data: Buffer) => {
            console.log(`[${hostname}] ${data.toString()}`);
        });

        instance.stderr.on('data', (data: Buffer) => {
            console.error(`[${hostname}] Error: ${data.toString()}`);
        });

        instance.on('exit', (code: number) => {
            console.log(`[${hostname}] Instance exited with code ${code}`);
            this.instances.delete(hostname);
        });

        return this.PORT;
    }

    updateActivity(hostname: string) {
        const instance = this.instances.get(hostname);
        if (instance) {
            instance.lastActive = Date.now();
        }
    }

    private startCleanupInterval() {
        setInterval(() => {
            const now = Date.now();
            for (const [hostname, instance] of this.instances.entries()) {
                if (now - instance.lastActive > this.IDLE_TIMEOUT) {
                    console.log(`Shutting down idle instance for ${hostname}`);
                    instance.process.kill();
                    this.instances.delete(hostname);
                }
            }
        }, 1000); // Check every second
    }
}

export const manager = new UnikernelManager(); 