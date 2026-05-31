import type { Env } from "@/../config/env";
import type { createEntriesController } from "@/controllers/entries.controller";
import type { RouteHandler } from "./middleware/types";
import { createApiComposer } from "./middleware/compose";
import { buildContext } from "./request-utils";

type EntriesController = ReturnType<typeof createEntriesController>;

type RouterDeps = {
  env: Env;
  health: RouteHandler;
  workTypes: RouteHandler;
  entries: EntriesController;
};

type BunRouteRequest = Request & { params?: Record<string, string> };

function adapt(
  api: (h: RouteHandler) => RouteHandler,
  handler: RouteHandler,
  paramKeys: string[] = [],
) {
  return (req: BunRouteRequest) => {
    const params: Record<string, string> = {};
    for (const key of paramKeys) {
      const value = req.params?.[key];
      if (value) params[key] = value;
    }
    const ctx = buildContext(req, params);
    return api(handler)(req, ctx);
  };
}

const optionsHandler: RouteHandler = async () => new Response(null, { status: 204 });

export function createRouter(deps: RouterDeps) {
  const api = createApiComposer(deps.env);
  const options = adapt(api, optionsHandler);

  return {
    "/api/health": {
      GET: adapt(api, deps.health),
      OPTIONS: options,
    },
    "/api/work-types": {
      GET: adapt(api, deps.workTypes),
      OPTIONS: options,
    },
    "/api/entries": {
      GET: adapt(api, deps.entries.list),
      POST: adapt(api, deps.entries.create),
      OPTIONS: options,
    },
    "/api/entries/:id": {
      PUT: adapt(api, deps.entries.update, ["id"]),
      DELETE: adapt(api, deps.entries.remove, ["id"]),
      OPTIONS: adapt(api, optionsHandler, ["id"]),
    },
  };
}
