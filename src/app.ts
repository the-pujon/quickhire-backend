import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import mongoose from "mongoose";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import config from "./app/config";

// ---------------------------------------------------------------------------
// Serverless-safe MongoDB connection (cached across warm Vercel invocations)
// ---------------------------------------------------------------------------
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};
declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache =
  global.mongooseCache ??
  (global.mongooseCache = { conn: null, promise: null });

async function connectDB(): Promise<void> {
  if (cached.conn) return;
  if (!cached.promise) {
    cached.promise = mongoose.connect(config.database_url as string, {
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
}

const app: Application = express();

// Trust the first proxy (required when running behind a reverse proxy/load balancer e.g. AWS, Nginx)
app.set("trust proxy", 1);

app.use(express.json());
app.use(bodyParser.json());

const allowedOrigins =
  process.env.FRONTEND_URLS?.split(",").map((url) => url.trim()) || [];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Request Origin:", origin);
      console.log("Allowed Origins:", allowedOrigins);

      if (!origin) {
        // Allow requests with no origin (e.g. mobile apps, curl)
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["set-cookie"],
  }),
);

app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);

// Ensure MongoDB is connected before handling any request (critical for serverless)
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// application routes
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hi Express Server v2!! you are live now!!!!");
});

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
