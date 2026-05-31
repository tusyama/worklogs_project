import type { HealthService } from "@/services/health.service";
import type { RouteHandler } from "@/http/middleware/types";

export function createHealthController(healthService: HealthService): RouteHandler {
  return async () => {
    const result = await healthService.check();
    return Response.json(result, { status: result.mongo ? 200 : 503 });
  };
}
