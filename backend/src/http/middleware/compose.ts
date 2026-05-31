import type { Env } from "../../config/env";
import { withCors } from "./cors";
import { withErrorBoundary } from "./error-boundary";
import { withJsonBody } from "./json-body";
import { withSecurityHeaders } from "./security-headers";
import type { RouteHandler } from "./types";

export function createApiComposer(env: Env) {
  return (handler: RouteHandler): RouteHandler =>
    withErrorBoundary(env, withSecurityHeaders(withCors(env, withJsonBody(handler))));
}
