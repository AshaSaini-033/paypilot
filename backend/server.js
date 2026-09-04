const express = require("express");
const cors = require("cors");
require("dotenv").config();

const initializeDatabase = require("./config/initDb");
const seedGateways = require("./data/seedGateways");
const gatewayRoutes = require("./routes/gatewayRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "PayPilot Backend is running 🚀"
    });
});

app.use("/api/gateways", gatewayRoutes);
app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 8080;

async function startServer() {
    try {
        // Pehle tables create honge
        await initializeDatabase();

        // Uske baad gateways insert honge
        await seedGateways();

        // Finally server start hoga
        app.listen(PORT, () => {
            console.log(`PayPilot backend running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
    }
}

startServer();