import type { RouteContext } from "./middleware/types";

export function buildContext(req: Request, params: Record<string, string> = {}): RouteContext {
  const url = new URL(req.url);
  const query: Record<string, string> = {};
  url.searchParams.forEach((v, k) => {
    query[k] = v;
  });
  return { params, query, body: undefined };
}
