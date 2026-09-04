const pool = require("../config/db");

// Gateway ka simulated payment response
async function processThroughGateway(gateway) {

    const latency = Number(gateway.average_latency);

    // Gateway ki response time simulate kar rahe hain
    await new Promise((resolve) => {
        setTimeout(resolve, latency);
    });

    // Database se latest gateway status check kar rahe hain
    const [rows] = await pool.query(
        `
        SELECT active, circuit_open, force_failure
        FROM gateways
        WHERE id = ?
        `,
        [gateway.id]
    );

    const currentGateway = rows[0];

    // Gateway unavailable hai toh payment fail
    if (
        !currentGateway ||
        !currentGateway.active ||
        currentGateway.circuit_open
    ) {
        return {
            success: false,
            latency,
            message: "Gateway unavailable"
        };
    }

    // Testing ke liye forced failure
    if (currentGateway.force_failure) {
        return {
            success: false,
            latency,
            message: "Gateway forced failure"
        };
    }

    // Normal success probability
    const success =
        Math.random() * 100 < Number(gateway.success_rate);

    return {
        success,
        latency,
        message: success
            ? "Payment successful"
            : "Gateway payment failed"
    };
}

module.exports = {
    processThroughGateway
};