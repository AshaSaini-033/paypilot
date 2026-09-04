import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Payment create karne ke liye
export const createPayment = async (paymentData) => {
    const response = await api.post("/payments", paymentData);
    return response.data;
};

// Saari payments fetch karne ke liye
export const getPayments = async () => {
    const response = await api.get("/payments");
    return response.data;
};

// Single payment fetch karne ke liye
export const getPaymentById = async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
};

// Saare gateways fetch karne ke liye
export const getGateways = async () => {
    const response = await api.get("/gateways");
    return response.data;
};

export default api;