import Stripe from "stripe";
import Transaction from "../models/Transaction.js";  
import User from "../models/User.js"; 

export const stripeWebhooks = async (request, response) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    // 1. Webhook signature verify karein
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log("Webhook Signature Error:", error.message);
    return response.status(400).send(`Webhook error: ${error.message}`);
  }

  try {
    // 2. Stripe events ko handle karein
    switch (event.type) {
      case "payment_intent.succeeded": 
      case "checkout.session.completed": {
        const session = event.data.object;
        
        // Metadata se details nikaalein
        const { transactionId, appId } = session.metadata;

        // 3. Check karein ki metadata sahi hai ya nahi
        if (appId === "SmartAssist" && transactionId) {
          const transactionData = await Transaction.findById(transactionId);

          if (transactionData && !transactionData.isPaid) {
            // 4. User ke credits badhayein
            await User.findByIdAndUpdate(transactionData.userId, {
              $inc: { credits: transactionData.credits },
            });

            // 5. Transaction ko Paid mark karein
            transactionData.isPaid = true;
            await transactionData.save();

            console.log(`Success: Transaction ${transactionId} updated to Paid!`);
          }
        } else {
            console.log("Metadata missing or appId mismatch");
        }
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
        break;
    }

    // Stripe ko confirm karein ki signal mil gaya hai
    response.json({ received: true });
  } catch (error) {
    console.log("Webhook Processing Error:", error);
    response.status(500).send("Internal Server Error");
  }
};