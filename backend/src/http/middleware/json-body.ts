import { API_MESSAGES } from "@worklog/shared";
import { AppError } from "@/errors/app-error";
import type { RouteHandler } from "./types";

const MAX_BODY = 64 * 1024;

export function withJsonBody(handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    const needsBody = req.method === "POST" || req.method === "PUT" || req.method === "PATCH";
    if (!needsBody) {
      return handler(req, { ...ctx, body: undefined });
    }

    const contentType = req.headers.get("Content-Type") ?? "";
    if (!contentType.includes("application/json")) {
      throw new AppError(400, API_MESSAGES.jsonContentTypeRequired);
    }

    const raw = await req.text();
    if (raw.length > MAX_BODY) {
      throw new AppError(413, API_MESSAGES.bodyTooLarge);
    }

    let body: unknown;
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch {
      throw new AppError(400, API_MESSAGES.invalidJson);
    }

    return handler(req, { ...ctx, body });
  };
}
