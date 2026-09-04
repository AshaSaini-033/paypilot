const pool = require("../config/db");

// Saare active gateways fetch karne ke liye
async function getActiveGateways() {
    const [gateways] = await pool.query(
        "SELECT * FROM gateways WHERE active = true AND circuit_open = false"
    );

    return gateways;
}

// Gateway ko ID se fetch karne ke liye
async function getGatewayById(id) {
    const [gateways] = await pool.query(
        "SELECT * FROM gateways WHERE id = ?",
        [id]
    );

    return gateways[0];
}

module.exports = {
    getActiveGateways,
    getGatewayById
};