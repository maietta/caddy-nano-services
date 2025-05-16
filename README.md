# caddy-nano-services

A project that combines Caddy with unikernel-based nano services, allowing for dynamic instance management and automatic scaling.

## Prerequisites

Before you begin, you'll need to:

1. Install [Ops](https://nanos.org/getting_started) for unikernel management
2. Install [Bun](https://bun.sh) for TypeScript/JavaScript runtime
3. Install [Caddy](https://caddyserver.com/docs/install) for reverse proxy

## Setup and Running

1. Install dependencies:
```bash
bun add -d @types/node
```

2. Compile the TypeScript files:
```bash
bun build src/instance-manager.ts src/caddy-middleware.ts --outdir dist --target node
```

3. Run the test:
```bash
bun run src/test.ts
```

## Getting Started with Ops

For detailed information about Ops and unikernels, visit:
https://nanos.org/getting_started