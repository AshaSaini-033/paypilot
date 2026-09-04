const pool = require("./db");

async function initializeDatabase() {
    try {
        // Gateways table create kar rahe hain
        await pool.query(`
            CREATE TABLE IF NOT EXISTS gateways (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE,
                active BOOLEAN DEFAULT TRUE,
                success_rate DECIMAL(5,2) DEFAULT 0,
                average_latency INT DEFAULT 0,
                transaction_fee DECIMAL(10,2) DEFAULT 0,
                failure_rate DECIMAL(5,2) DEFAULT 0,
                circuit_open BOOLEAN DEFAULT FALSE,
                force_failure BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Existing database mein force_failure column add kar rahe hain
        try {
            await pool.query(`
                ALTER TABLE gateways
                ADD COLUMN force_failure BOOLEAN DEFAULT FALSE
            `);
        } catch (error) {
            // Column already exist karta hai toh ignore kar rahe hain
        }

        // Payments table create kar rahe hain
        await pool.query(`
            CREATE TABLE IF NOT EXISTS payments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                transaction_id VARCHAR(100) NOT NULL UNIQUE,
                amount DECIMAL(12,2) NOT NULL,
                payment_method VARCHAR(30) NOT NULL,
                bank VARCHAR(50) NOT NULL,
                customer_email VARCHAR(150),
                initial_gateway VARCHAR(50),
                final_gateway VARCHAR(50),
                status VARCHAR(30) DEFAULT 'PROCESSING',
                attempts INT DEFAULT 0,
                latency INT DEFAULT 0,
                recovered BOOLEAN DEFAULT FALSE,
                ai_reason TEXT,
                ai_confidence DECIMAL(5,2),
                ai_action VARCHAR(30),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Existing database mein AI columns add kar rahe hain
        const aiColumns = [
            ["ai_reason", "TEXT"],
            ["ai_confidence", "DECIMAL(5,2)"],
            ["ai_action", "VARCHAR(30)"]
        ];

        for (const [column, type] of aiColumns) {
            try {
                await pool.query(
                    `ALTER TABLE payments ADD COLUMN ${column} ${type}`
                );
            } catch (error) {
                // Column already exist karta hai toh ignore kar rahe hain
            }
        }

        console.log("Database tables initialized successfully");

    } catch (error) {
        console.error(
            "Database initialization failed:",
            error.message
        );

        throw error;
    }
}

module.exports = initializeDatabase;