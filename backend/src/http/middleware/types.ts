export type RouteContext = {
  params: Record<string, string>;
  query: Record<string, string>;
  body: unknown;
};

export type RouteHandler = (req: Request, ctx: RouteContext) => Promise<Response> | Response;
