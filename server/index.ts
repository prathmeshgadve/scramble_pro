import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { connectDB } from "./db";

// --- MODULE AUGMENTATION ---
// This MUST be at the top level, not inside a function
declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
// ---------------------------

// This will be our main startup function
async function startServer() {
  try {
    const app = express();

    /* This block was moved to the top level
    declare module 'http' {
      interface IncomingMessage {
        rawBody: unknown
      }
    }
    */
    app.use(express.json({
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      }
    }));
    app.use(express.urlencoded({ extended: false }));

    app.use((req, res, next) => {
      const start = Date.now();
      const path = req.path;
      let capturedJsonResponse: Record<string, any> | undefined = undefined;

      const originalResJson = res.json;
      res.json = function (bodyJson, ...args) {
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, [bodyJson, ...args]);
      };

      res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
          let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
          if (capturedJsonResponse) {
            logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
          }

          if (logLine.length > 80) {
            logLine = logLine.slice(0, 79) + "…";
          }

          log(logLine);
        }
      });

      next();
    });

    // --- Startup Sequence ---
    log("Attempting to connect to database...");
    await connectDB();
    log("✅ Database connection successful.");

    log("Registering routes...");
    const server = await registerRoutes(app);
    log("✅ Routes registered.");

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    if (app.get("env") === "development") {
      log("Development environment. Setting up Vite...");
      await setupVite(app, server);
      log("✅ Vite setup complete.");
    } else {
      log("Production environment. Serving static files...");
      serveStatic(app);
      log("✅ Static files served.");
    }

    const port = parseInt(process.env.PORT || '5000', 10);
    server.listen({
      port,
      host: "0.0.0.0",
      // reusePort: true, // <-- This was causing the ENOTSUP error on Windows
    }, () => {
      log(`🚀 Server is listening and serving on port ${port}`);
    });

  } catch (error) {
    // --- THIS IS THE IMPORTANT PART ---
    // If anything above fails, this block will run
    console.error("❌ Fatal error during server startup:");
    console.error(error);
    process.exit(1); // Exit the script with an error code
  }
}

// Start the server
startServer();