import type { WorkTypesService } from "@/services/work-types.service";
import type { RouteHandler } from "@/http/middleware/types";

export function createWorkTypesController(service: WorkTypesService): RouteHandler {
  return async () => {
    const items = await service.list();
    return Response.json({ items });
  };
}
