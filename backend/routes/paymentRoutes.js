const express = require("express");
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const paymentProcessor = require("../services/paymentProcessor");
const idempotency = require("../middleware/idempotency");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [payments] = await pool.query(
            "SELECT * FROM payments ORDER BY id DESC"
        );

        res.json(payments);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch payments"
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const [payments] = await pool.query(
            "SELECT * FROM payments WHERE id = ?",
            [req.params.id]
        );

        if (payments.length === 0) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        res.json(payments[0]);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch payment"
        });
    }
});

// Payment create + AI routing + recovery
router.post("/", idempotency, async (req, res) => {

    try {

        const {
            amount,
            paymentMethod,
            bank,
            customerEmail
        } = req.body;

        if (!amount || !paymentMethod || !bank) {
            return res.status(400).json({
                message: "Amount, payment method and bank are required"
            });
        }

        const transactionId =
            req.idempotencyKey || `TXN-${uuidv4()}`;

        const [result] = await pool.query(
            `
            INSERT INTO payments
            (transaction_id, amount, payment_method, bank,
             customer_email, status, attempts, recovered)
            VALUES (?, ?, ?, ?, ?, 'PROCESSING', 0, false)
            `,
            [
                transactionId,
                amount,
                paymentMethod,
                bank,
                customerEmail || null
            ]
        );

        const [rows] = await pool.query(
            "SELECT * FROM payments WHERE id = ?",
            [result.insertId]
        );

        // Payment ko AI routing engine ke through process kar rahe hain
        const processedPayment =
            await paymentProcessor.processPayment(rows[0]);

        res.status(201).json(processedPayment);

    } catch (error) {

        console.error("Payment processing failed:", error.message);

        res.status(500).json({
            message: "Payment processing failed"
        });
    }
});

module.exports = router;