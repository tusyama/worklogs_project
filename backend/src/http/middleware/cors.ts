import type { Env } from "@/config/env";
import type { RouteHandler } from "./types";

export function withCors(env: Env, handler: RouteHandler): RouteHandler {
  const origins = env.CORS_ORIGIN.split(",").map((o) => o.trim());

  return async (req, ctx) => {
    const origin = req.headers.get("Origin") ?? "";
    const allowAnyOrigin = env.NODE_ENV !== "production" && origins.includes("*");
    const allowed = allowAnyOrigin || (origin !== "" && origins.includes(origin));

    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: allowed && origin ? corsHeaders(origin) : undefined,
      });
    }

    const response = await handler(req, ctx);
    const headers = new Headers(response.headers);
    if (allowed && origin) {
      const cors = corsHeaders(origin);
      cors.forEach((v, k) => headers.set(k, v));
    }
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}

function corsHeaders(origin: string): Headers {
  const h = new Headers();
  h.set("Access-Control-Allow-Origin", origin);
  h.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  h.set("Access-Control-Allow-Headers", "Content-Type");
  return h;
}
