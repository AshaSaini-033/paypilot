const pool = require("../config/db");

// Payment create karne ke liye
async function createPayment(payment) {
    const [result] = await pool.query(
        `
        INSERT INTO payments
        (transaction_id, amount, payment_method, bank, customer_email,
         status, attempts, recovered)
        VALUES (?, ?, ?, ?, ?, 'PROCESSING', 0, false)
        `,
        [
            payment.transactionId,
            payment.amount,
            payment.paymentMethod,
            payment.bank,
            payment.customerEmail || null
        ]
    );

    const [rows] = await pool.query(
        "SELECT * FROM payments WHERE id = ?",
        [result.insertId]
    );

    return rows[0];
}

// Payment status update karne ke liye
async function updatePayment(id, data) {
    const fields = [];
    const values = [];

    Object.entries(data).forEach(([key, value]) => {
        fields.push(`${key} = ?`);
        values.push(value);
    });

    values.push(id);

    await pool.query(
        `UPDATE payments SET ${fields.join(", ")} WHERE id = ?`,
        values
    );

    const [rows] = await pool.query(
        "SELECT * FROM payments WHERE id = ?",
        [id]
    );

    return rows[0];
}

module.exports = {
    createPayment,
    updatePayment
};