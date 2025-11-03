// global.d.ts
// This prevents TypeScript errors in Next.js builds for Cloudflare Functions.

declare type PagesFunction<Env = Record<string, unknown>> = (
  context: {
    request: Request;
    env: Env;
    params?: Record<string, string>;
    waitUntil?(promise: Promise<any>): void;
    next?(): Promise<Response>;
    data?: Record<string, unknown>;
  }
) => Promise<Response> | Response;