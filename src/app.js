const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "User Management API is running",
  });
});

// Error middleware
app.use(errorMiddleware);

// Render provides the PORT environment variable
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});