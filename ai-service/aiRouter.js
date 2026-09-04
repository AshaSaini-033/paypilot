const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Groq GenAI se routing decision lene ke liye
async function getAIRoutingDecision(paymentData) {

    const prompt = `
You are PayPilot, an intelligent payment routing agent.

Payment:
${JSON.stringify(paymentData.payment, null, 2)}

Available Gateways:
${JSON.stringify(paymentData.gateways, null, 2)}

Select the best healthy gateway.

Consider:
- Success rate
- Failure rate
- Latency
- Transaction fee
- Gateway health

Return ONLY valid JSON:

{
    "recommended_gateway": "Gateway A",
    "reason": "Short explanation",
    "confidence": 0.95,
    "action": "ROUTE"
}
`;

    const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
            {
                role: "system",
                content:
                    "You are a payment routing AI agent. Always return valid JSON only."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 0.2
    });

    const content =
        completion.choices[0]?.message?.content || "";

    try {
        return JSON.parse(content);
    } catch (error) {
        console.error("Invalid AI JSON:", content);
        throw new Error("AI returned invalid JSON");
    }
}

module.exports = {
    getAIRoutingDecision
};