const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// Saare gateways fetch karne ke liye
router.get("/", async (req, res) => {
    try {
        const [gateways] = await pool.query(
            "SELECT * FROM gateways ORDER BY id"
        );

        res.json(gateways);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch gateways"
        });
    }
});

// Gateway ID se fetch karne ke liye
router.get("/:id", async (req, res) => {
    try {
        const [gateways] = await pool.query(
            "SELECT * FROM gateways WHERE id = ?",
            [req.params.id]
        );

        if (gateways.length === 0) {
            return res.status(404).json({
                message: "Gateway not found"
            });
        }

        res.json(gateways[0]);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch gateway"
        });
    }
});

// Testing ke liye gateway ko force failure mode mein daalne ke liye
router.patch("/:id/failure", async (req, res) => {
    try {
        const { failure } = req.body;

        await pool.query(
            "UPDATE gateways SET force_failure = ? WHERE id = ?",
            [failure, req.params.id]
        );

        res.json({
            message: failure
                ? "Gateway failure mode enabled"
                : "Gateway failure mode disabled"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update gateway"
        });
    }
});

module.exports = router;