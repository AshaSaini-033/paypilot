

require("dotenv").config();

const express = require("express");
const { getAIRoutingDecision } = require("./aiRouter");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "PayPilot GenAI Service is running 🤖"
    });
});

app.post("/api/ai/route", async (req, res) => {
    try {
        const decision = await getAIRoutingDecision(req.body);

        res.json(decision);
    } catch (error) {
        console.error("AI routing failed:", error.message);

        res.status(500).json({
            message: "AI routing failed"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`PayPilot GenAI Service running on port ${PORT}`);
});