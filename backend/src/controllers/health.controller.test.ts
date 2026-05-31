import { describe, expect, it, vi } from "vitest";
import { createHealthController } from "./health.controller";
import type { HealthService } from "../services/health.service";

describe("createHealthController", () => {
  it("returns 200 when dependencies are healthy", async () => {
    const healthService = {
      check: vi.fn().mockResolvedValue({ status: "ok", mongo: true, redis: true }),
    } as unknown as HealthService;

    const response = await createHealthController(healthService)(new Request("http://x"), {});
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("ok");
  });

  it("returns 200 when mongo is healthy even if redis is degraded", async () => {
    const healthService = {
      check: vi.fn().mockResolvedValue({ status: "degraded", mongo: true, redis: false }),
    } as unknown as HealthService;

    const response = await createHealthController(healthService)(new Request("http://x"), {});
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("degraded");
  });

  it("returns 503 when mongo is unavailable", async () => {
    const healthService = {
      check: vi.fn().mockResolvedValue({ status: "unavailable", mongo: false, redis: true }),
    } as unknown as HealthService;

    const response = await createHealthController(healthService)(new Request("http://x"), {});
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.status).toBe("unavailable");
  });
});
