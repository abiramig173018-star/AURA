
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();
require("./models/initDatabase");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/machines", require("./routes/machineRoutes"));
app.use("/api/production", require("./routes/productionRoutes"));
app.use("/api/safety", require("./routes/safetyRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
// Home API
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "AURA Industrial AI Co-Pilot Backend is running!",
        version: "1.0.0"
    });
});

// Health Check API
app.get("/api/health", (req, res) => {
    res.json({
        status: "healthy",
        service: "AURA Backend",
        timestamp: new Date().toISOString()
    });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`AURA Backend running on port ${PORT}`);
});
