import Stripe from "stripe";
import Transaction from "../models/Transaction.js";  
import User from "../models/User.js"; 

export const stripeWebhooks = async (request, response) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    // Webhook signature verify karein
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
  
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      
     
      const { transactionId, appId } = session.metadata || {};

      if (appId === "SmartAssist" && transactionId) {
        const transactionData = await Transaction.findById(transactionId);

      
        if (transactionData && !transactionData.isPaid) {
          
          // 1. User ke credits badhayein
          await User.findByIdAndUpdate(transactionData.userId, {
            $inc: { credits: transactionData.credits },
          });

          // 2. Transaction ko Paid mark karein
          transactionData.isPaid = true;
          await transactionData.save();

          console.log(`Success: Transaction ${transactionId} updated to Paid!`);
        }
      } else {
        console.log("Metadata missing or appId mismatch");
      }
    } else {
      console.log("Unhandled event type:", event.type);
    }

    // Stripe ko 200 OK bhejein
    response.json({ received: true });
  } catch (error) {
    console.log("Webhook Processing Error:", error);
    response.status(500).send("Internal Server Error");
  }
};