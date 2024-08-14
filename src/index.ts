import express from "express";
import logger from "./utils/logger";
import cors from "cors";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./utils/swaggerConfig";
import moderateJokesRouter from "./routes/moderateJokes.routes"; // Import your joke routes
import { baseUrl } from "./configs/config";
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/moderate-jokes", moderateJokesRouter);

const PORT = process.env.PORT || "9092";

app.listen(PORT, () => {
  logger.info(
    `Server is running on  ${process.env.NEXT_PUBLIC_MODERATE_SERVICE}:${PORT}/`,
  );
  logger.info(
    `Swagger docs are available at ${process.env.NEXT_PUBLIC_MODERATE_SERVICE}/api-docs`,
  );
});
