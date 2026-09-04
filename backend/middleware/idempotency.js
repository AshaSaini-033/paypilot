const pool = require("../config/db");

// Duplicate payment requests ko prevent karne ke liye
async function checkIdempotency(req, res, next) {

    const key = req.headers["idempotency-key"];

    // Idempotency key nahi hai toh request continue
    if (!key) {
        return next();
    }

    const [payments] = await pool.query(
        "SELECT * FROM payments WHERE transaction_id = ?",
        [key]
    );

    // Same payment already exist karti hai
    if (payments.length > 0) {
        return res.status(200).json(payments[0]);
    }

    req.idempotencyKey = key;

    next();
}

module.exports = checkIdempotency;