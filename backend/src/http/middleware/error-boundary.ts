import { API_MESSAGES } from "@worklog/shared";
import { Error as MongooseError } from "mongoose";
import { AppError } from "@/errors/app-error";
import type { Env } from "@/config/env";
import type { RouteHandler } from "./types";

export function withErrorBoundary(env: Env, handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      if (err instanceof AppError) {
        return Response.json(
          { message: err.message, details: err.details },
          { status: err.statusCode },
        );
      }
      if (err instanceof MongooseError.ValidationError) {
        const details = Object.fromEntries(
          Object.entries(err.errors).map(([key, issue]) => [key, issue.message]),
        );
        return Response.json({ message: API_MESSAGES.validationError, details }, { status: 400 });
      }
      if (err instanceof MongooseError.CastError) {
        const details =
          env.NODE_ENV === "production" ? { path: err.path } : { path: err.path, value: err.value };
        return Response.json(
          {
            message: API_MESSAGES.validationError,
            details,
          },
          { status: 400 },
        );
      }
      console.error(err);
      const message =
        env.NODE_ENV === "production" ? API_MESSAGES.internalError : "Internal Server Error";
      return Response.json({ message }, { status: 500 });
    }
  };
}
