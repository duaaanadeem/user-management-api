const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorMiddleware");

dotenv.config();

// ==================== DATABASE ====================

connectDB();

const app = express();

// ==================== SECURITY ====================

app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000"
    })
);

// ==================== RATE LIMITING ====================

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        message: "Too many requests. Please try again later."
    }
});

app.use(limiter);

// ==================== LOGGING ====================

app.use(morgan("dev"));

// ==================== JSON BODY PARSER ====================

app.use(express.json());

// ==================== ROUTES ====================

app.use("/api/users", userRoutes);

// ==================== ERROR HANDLER ====================

app.use(errorHandler);

// ==================== SERVER ====================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});