// loaders/routes.ts
import fs from "fs";
import path from "path";
import { Express } from "express";
import logger from "../config/logger";

export const loadRoutes = async (app: Express) => {
  const modulesPath = path.join(__dirname, "../modules");
  const moduleFolders = fs.readdirSync(modulesPath);

  for (const folder of moduleFolders) {
    // Try different route file naming patterns
    const routeFiles = [
      path.join(modulesPath, folder, `${folder}.routes.ts`),
      path.join(modulesPath, folder, `${folder}.route.ts`)
    ];

    for (const routeFile of routeFiles) {
      if (fs.existsSync(routeFile)) {
        try {
          const routeModule = await import(routeFile);
          const router = routeModule.default || routeModule.router;
          if (router) {
            app.use(`/api/v1/${folder}`, router);
            logger.info(`✅ Loaded route: ${folder}`);
            break;
          }
        } catch (error) {
          logger.error(`❌ Failed to load route ${folder} :${error}`);
        }
      }
    }
  }
};
