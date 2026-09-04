const pool = require("../config/db");

async function seedGateways() {
    try {
        // Default gateways insert kar rahe hain
        const gateways = [
            ["Gateway A", 1, 97.8, 180, 2.0, 2.2, 0],
            ["Gateway B", 1, 91.2, 120, 1.0, 8.8, 0],
            ["Gateway C", 1, 99.1, 310, 3.0, 0.9, 0]
        ];

        for (const gateway of gateways) {
            await pool.query(
                `
                INSERT IGNORE INTO gateways
                (name, active, success_rate, average_latency,
                 transaction_fee, failure_rate, circuit_open)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                `,
                gateway
            );
        }

        console.log("Default gateways added successfully");
    } catch (error) {
        console.error("Gateway seeding failed:", error.message);
    }
}
module.exports = seedGateways;