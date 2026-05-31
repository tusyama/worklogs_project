import { API_MESSAGES } from "@worklog/shared";
import { Error as MongooseError } from "mongoose";
import { describe, expect, it, vi } from "vitest";
import type { Env } from "../../config/env";
import { AppError } from "../../errors/app-error";
import { withErrorBoundary } from "./error-boundary";

const env = { NODE_ENV: "test" } as Env;

describe("withErrorBoundary", () => {
  it("returns AppError status and body", async () => {
    const handler = withErrorBoundary(env, async () => {
      throw new AppError(404, "not found", { id: "x" });
    });

    const response = await handler(new Request("http://localhost/test"), {});
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ message: "not found", details: { id: "x" } });
  });

  it("maps Mongoose ValidationError to 400", async () => {
    const validationError = new MongooseError.ValidationError();
    validationError.addError(
      "volume",
      new MongooseError.ValidatorError({
        path: "volume",
        message: "Path `volume` is less than minimum allowed value (0.0001).",
      }),
    );

    const handler = withErrorBoundary(env, async () => {
      throw validationError;
    });

    const response = await handler(new Request("http://localhost/test"), {});
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe(API_MESSAGES.validationError);
    expect(body.details.volume).toContain("minimum");
  });

  it("maps Mongoose CastError to 400", async () => {
    const castError = new MongooseError.CastError("ObjectId", "bad-id", "workTypeId");

    const handler = withErrorBoundary(env, async () => {
      throw castError;
    });

    const response = await handler(new Request("http://localhost/test"), {});
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe(API_MESSAGES.validationError);
    expect(body.details.path).toBe("workTypeId");
  });

  it("returns 500 for unknown errors", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const handler = withErrorBoundary(env, async () => {
      throw new Error("boom");
    });

    const response = await handler(new Request("http://localhost/test"), {});

    expect(response.status).toBe(500);
    consoleSpy.mockRestore();
  });
});
