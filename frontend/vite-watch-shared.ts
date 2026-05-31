import path from "node:path";
import type { Plugin, ViteDevServer } from "vite";

/** Vite watches only `frontend/` by default; `@worklog/shared` lives in the monorepo root. */
export function watchSharedPackage(sharedSrc: string): Plugin {
  const sharedRoot = path.resolve(sharedSrc);

  const isUnderShared = (file: string) => {
    const resolved = path.resolve(file);
    return resolved === sharedRoot || resolved.startsWith(`${sharedRoot}${path.sep}`);
  };

  const reload = (server: ViteDevServer, file: string) => {
    console.log(
      `[worklog] @worklog/shared changed → full reload (${path.relative(sharedRoot, file)})`,
    );
    server.moduleGraph.invalidateAll();
    server.ws.send({ type: "full-reload", path: "*" });
  };

  return {
    name: "worklog-watch-shared",
    configureServer(server) {
      server.watcher.add(sharedRoot);

      const onFsChange = (file: string) => {
        if (!isUnderShared(file)) return;
        reload(server, file);
      };

      server.watcher.on("change", onFsChange);
      server.watcher.on("add", onFsChange);
      server.watcher.on("unlink", onFsChange);
    },
    handleHotUpdate({ file, server }) {
      if (!isUnderShared(file)) return;
      reload(server, file);
      return [];
    },
  };
}
