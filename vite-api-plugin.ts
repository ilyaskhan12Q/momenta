import type { Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

export function apiRoutesPlugin(): Plugin {
  return {
    name: 'api-routes-plugin',
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        try {
          const host = req.headers.host || 'localhost:3000';
          const urlObj = new URL(req.url, `http://${host}`);
          const pathname = urlObj.pathname;
          const method = req.method || 'GET';

          let body: Buffer | undefined;
          if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(chunk);
            }
            body = Buffer.concat(chunks);
          }

          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (value) {
              if (Array.isArray(value)) {
                value.forEach((v) => headers.append(key, v));
              } else {
                headers.set(key, value);
              }
            }
          }

          const webReq = new Request(urlObj.href, {
            method,
            headers,
            body: body && body.length > 0 ? body : undefined,
          });

          let handlerModule: any;
          let params: Record<string, string> = {};

          if (pathname === '/api/health') {
            handlerModule = await server.ssrLoadModule('/src/app/api/health/route.ts');
          } else if (pathname === '/api/v1/experiences' || pathname === '/api/v1/experiences/') {
            handlerModule = await server.ssrLoadModule('/src/app/api/v1/experiences/route.ts');
          } else if (pathname.startsWith('/api/v1/manifests/')) {
            const token = pathname.replace('/api/v1/manifests/', '');
            params = { token };
            handlerModule = await server.ssrLoadModule('/src/app/api/v1/manifests/[token]/route.ts');
          } else if (pathname.includes('/scenes')) {
            const parts = pathname.split('/');
            const id = parts[4];
            params = { id };
            handlerModule = await server.ssrLoadModule('/src/app/api/v1/experiences/[id]/scenes/route.ts');
          } else if (pathname.includes('/publish')) {
            const parts = pathname.split('/');
            const id = parts[4];
            params = { id };
            handlerModule = await server.ssrLoadModule('/src/app/api/v1/experiences/[id]/publish/route.ts');
          } else if (pathname.includes('/emotion')) {
            const parts = pathname.split('/');
            const id = parts[4];
            params = { id };
            handlerModule = await server.ssrLoadModule('/src/app/api/v1/experiences/[id]/emotion/route.ts');
          } else if (pathname.startsWith('/api/v1/experiences/')) {
            const id = pathname.replace('/api/v1/experiences/', '');
            params = { id };
            handlerModule = await server.ssrLoadModule('/src/app/api/v1/experiences/[id]/route.ts');
          }

          if (handlerModule && typeof handlerModule[method] === 'function') {
            const routeFn = handlerModule[method];
            const webRes: Response = await routeFn(webReq, { params: Promise.resolve(params) });

            res.statusCode = webRes.status;
            webRes.headers.forEach((val, k) => {
              res.setHeader(k, val);
            });

            const resArrayBuffer = await webRes.arrayBuffer();
            res.end(Buffer.from(resArrayBuffer));
            return;
          }

          next();
        } catch (err: any) {
          console.error('[API Middleware Error]', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ code: 'INTERNAL_ERROR', message: err.message }));
        }
      });
    },
  };
}
