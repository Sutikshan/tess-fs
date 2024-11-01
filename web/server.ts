import type { AppLoadContext, RequestHandler, ServerBuild } from '@remix-run/cloudflare';
import { logDevReady } from "@remix-run/cloudflare";
import { initAuth } from "app/lib/auth.server";
import { authMiddleware } from 'AuthMiddleware';
import type { Auth, Session, User } from "better-auth";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { Hono } from "hono";
import { poweredBy } from 'hono/powered-by';
import { staticAssets } from 'remix-hono/cloudflare';
import { remix } from "remix-hono/handler";

export type Bindings = {
  DB: D1Database;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  BETTER_AUTH_TRUSTED_ORIGINS: string;
};

export type Variables = {
  db: DrizzleD1Database;
  user: User | null;
  session: Session | null;
};

export type ContextEnv = {
  Bindings: Bindings;
  Variables: Variables;
};

const app = new Hono<ContextEnv>();
let handler: RequestHandler | undefined

app.use(poweredBy())
app.get('/hono', (c) => c.text('Hono, ' + c.env.BETTER_AUTH_URL))

app.use(
  async (c, next) => {
    if (process.env.NODE_ENV !== 'development' || import.meta.env.PROD) {
      return staticAssets()(c, next)
    }
    await next()
  },
  authMiddleware,
  async (c, next) => {
    if (process.env.NODE_ENV !== 'development' || import.meta.env.PROD) {
      const serverBuild = await import('./build/server')

      return remix({
        build: serverBuild as unknown as ServerBuild,
        mode: 'production',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getLoadContext(c) {
          return {
            cloudflare: {
              env: c.env
            }
          }
        }
      })(c, next)
    } else {
      if (!handler) {
        // @ts-expect-error it's not typed
        const build = await import('virtual:remix/server-build')
        const { createRequestHandler } = await import('@remix-run/cloudflare')

        handler = createRequestHandler(build, 'development')

        if (process.env.NODE_ENV === "development") {
          logDevReady(build);
        }

      }

      const remixContext = {
        cloudflare: {
          env: c.env,
          var: c.var
        }
      } as unknown as AppLoadContext

      return handler(c.req.raw, remixContext)
    }
  }
)

app.on(["POST", "GET"], "/api/auth/**", (c) => {
  const auth: Auth = initAuth(c.env as Bindings);
  return auth.handler(c.req.raw);
});

export default app