import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import ErrorMiddleware from "./middlewares/Error.js";
import morganMiddleware from "./logger/morgan.logger.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import YAML from "yaml";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = fs.readFileSync(path.resolve(__dirname, "./swagger.yaml"), "utf8");
const swaggerDocument = YAML.parse(
  file?.replace(
    "- url: ${{server}}",
    `- url: ${process.env.CLIENTAPP_HOST_URL || "http://localhost:5500"}/api/v1`
  )
);

const app = express();

// ================= LOGGER =================
app.use(morganMiddleware);

// ================= CORS =================
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_W_URL,
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};

app.use(cors(corsOptions));

// ================= BODY PARSERS =================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ================= STATIC UPLOADS (🔥 REQUIRED) =================
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// ================= ROUTES =================
import userRoutes from "./router/userRoutes.js";
import LinkRouter from "./router/linksRoutes.js";
import blogsRoutes from "./router/blogsRoutes.js";

app.use("/api/v1", userRoutes);
app.use("/api/v1", LinkRouter);
app.use("/api/v1", blogsRoutes);

// ================= SWAGGER =================
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: { docExpansion: "none" },
    customSiteTitle: "Hospital API docs",
  })
);

// ================= ERROR HANDLER (LAST) =================
app.use(ErrorMiddleware);

export default app;
