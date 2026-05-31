import {
  API_MESSAGES,
  entriesListQuerySchema,
  entryIdParamSchema,
  workEntryCreateSchema,
  workEntryUpdateSchema,
} from "@worklog/shared";
import { AppError } from "../errors/app-error";
import type { EntriesService } from "../services/entries.service";
import type { RouteHandler } from "../http/middleware/types";

export function createEntriesController(service: EntriesService) {
  const list: RouteHandler = async (_req, ctx) => {
    const parsed = entriesListQuerySchema.safeParse(ctx.query);
    if (!parsed.success) {
      throw new AppError(400, API_MESSAGES.invalidQueryParams, parsed.error.flatten());
    }
    const items = await service.list(parsed.data);
    return Response.json({ items });
  };

  const create: RouteHandler = async (_req, ctx) => {
    const parsed = workEntryCreateSchema.safeParse(ctx.body);
    if (!parsed.success) {
      throw new AppError(400, API_MESSAGES.validationError, parsed.error.flatten());
    }
    const item = await service.create(parsed.data);
    return Response.json({ item }, { status: 201 });
  };

  const update: RouteHandler = async (_req, ctx) => {
    const idParsed = entryIdParamSchema.safeParse(ctx.params);
    if (!idParsed.success) {
      throw new AppError(400, API_MESSAGES.invalidId);
    }
    const bodyParsed = workEntryUpdateSchema.safeParse(ctx.body);
    if (!bodyParsed.success) {
      throw new AppError(400, API_MESSAGES.validationError, bodyParsed.error.flatten());
    }
    const item = await service.update(idParsed.data.id, bodyParsed.data);
    return Response.json({ item });
  };

  const remove: RouteHandler = async (_req, ctx) => {
    const idParsed = entryIdParamSchema.safeParse(ctx.params);
    if (!idParsed.success) {
      throw new AppError(400, API_MESSAGES.invalidId);
    }
    await service.delete(idParsed.data.id);
    return new Response(null, { status: 204 });
  };

  return { list, create, update, remove };
}
