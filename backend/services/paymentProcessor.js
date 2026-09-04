const aiRouter = require("./aiRouter");
const gatewaySimulator = require("./gatewaySimulator");
const paymentService = require("./paymentService");

// Payment process + automatic recovery
async function processPayment(payment) {

    const startTime = Date.now();

    // GenAI se first gateway select kar rahe hain
    let aiDecision = await aiRouter.selectBestGateway(
        null,
        payment
    );

    let gateway = aiDecision.gateway;

    const initialGateway = gateway.name;

    // First AI decision database mein save kar rahe hain
    await paymentService.updatePayment(payment.id, {
        ai_reason: aiDecision.reason,
        ai_confidence: aiDecision.confidence,
        ai_action: aiDecision.action
    });

    // Maximum 2 attempts
    for (let attempt = 1; attempt <= 2; attempt++) {

        console.log(
            `Attempt ${attempt}: Processing through ${gateway.name}`
        );

        const result =
            await gatewaySimulator.processThroughGateway(gateway);

        const totalLatency = Date.now() - startTime;

        await paymentService.updatePayment(payment.id, {
            attempts: attempt,
            latency: totalLatency,
            initial_gateway: initialGateway,
            final_gateway: gateway.name
        });

        // Payment successful
        if (result.success) {

            console.log(
                `Payment successful through ${gateway.name}`
            );

            return await paymentService.updatePayment(
                payment.id,
                {
                    status: attempt === 1
                        ? "SUCCESS"
                        : "RECOVERED",

                    recovered: attempt > 1
                }
            );
        }

        // Recovery
        if (attempt === 1) {

            console.log(
                `${gateway.name} failed. Starting automatic recovery...`
            );

            // GenAI se alternate gateway select kar rahe hain
            aiDecision = await aiRouter.selectBestGateway(
                gateway.name,
                payment
            );

            gateway = aiDecision.gateway;

            // Recovery AI decision save kar rahe hain
            await paymentService.updatePayment(payment.id, {
                ai_reason: aiDecision.reason,
                ai_confidence: aiDecision.confidence,
                ai_action: "RECOVERY"
            });
        }
    }

    console.log(
        "Payment failed after recovery attempt"
    );

    return await paymentService.updatePayment(
        payment.id,
        {
            status: "FAILED",
            recovered: false
        }
    );
}

module.exports = {
    processPayment
};