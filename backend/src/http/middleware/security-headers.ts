import type { RouteHandler } from "./types";

export function withSecurityHeaders(handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    const response = await handler(req, ctx);
    const headers = new Headers(response.headers);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-Frame-Options", "DENY");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}
