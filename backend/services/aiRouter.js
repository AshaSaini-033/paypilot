const gatewayService = require("./gatewayService");

// GenAI service se best gateway select karne ke liye
async function selectBestGateway(
    excludedGateway = null,
    payment = null
) {
    const gateways = await gatewayService.getActiveGateways();

    // Previous failed gateway ko remove kar rahe hain
    const availableGateways = gateways.filter(
        (gateway) => gateway.name !== excludedGateway
    );

    if (availableGateways.length === 0) {
        throw new Error("No healthy gateway available");
    }

    try {
        // Groq GenAI service ko payment aur gateways bhej rahe hain
        const response = await fetch(
            "http://localhost:5000/api/ai/route",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    payment: payment || {},
                    gateways: availableGateways
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                `AI service returned ${response.status}`
            );
        }

        // GenAI ka response le rahe hain
        const decision = await response.json();

        console.log("GenAI Decision:", decision);

        // AI ke recommended gateway ko find kar rahe hain
        const selectedGateway = availableGateways.find(
            (gateway) =>
                gateway.name === decision.recommended_gateway
        );

        // AI ne valid gateway diya
        if (selectedGateway) {
            return {
                gateway: selectedGateway,
                reason: decision.reason,
                confidence: Number(decision.confidence) || 0,
                action: decision.action || "ROUTE"
            };
        }

        // AI invalid gateway de toh safe fallback
        const fallbackGateway = [...availableGateways].sort(
            (a, b) =>
                Number(b.success_rate) -
                Number(a.success_rate)
        )[0];

        return {
            gateway: fallbackGateway,
            reason: "AI returned invalid gateway. Safe fallback selected.",
            confidence: 0,
            action: "FALLBACK"
        };

    } catch (error) {

        console.error(
            "GenAI unavailable:",
            error.message
        );

        // AI unavailable hone par safe fallback
        const fallbackGateway = [...availableGateways].sort(
            (a, b) =>
                Number(b.success_rate) -
                Number(a.success_rate)
        )[0];

        return {
            gateway: fallbackGateway,
            reason: "GenAI unavailable. Safe gateway fallback used.",
            confidence: 0,
            action: "FALLBACK"
        };
    }
}

module.exports = {
    selectBestGateway
};