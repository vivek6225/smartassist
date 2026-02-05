import Stripe from "stripe";
import transactionModel from "../models/Transaction.js";  
import userModel from "../models/User.js"; 

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
    // 2. Stripe Dashboard ke hisaab se event type check karein
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { transactionId, appId } = session.metadata;

        // 3. Security check: Sirf apne app ki transactions update karein
        if (appId === "SmartAssist") {
          // findById use karein direct ID ke liye
          const transactionData = await transactionModel.findById(transactionId);

          if (transactionData && !transactionData.isPaid) {
            // 4. User ke credits badhayein
            await userModel.findByIdAndUpdate(transactionData.userId, {
              $inc: { credits: transactionData.credits },
            });

            // 5. Transaction ko Paid mark karein
            transactionData.isPaid = true;
            await transactionData.save();

            console.log(`Success: Transaction ${transactionId} is now Paid!`);
          }
        }
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
        break;
    }

    // Stripe ko 200 OK response bhejein
    response.json({ received: true });
  } catch (error) {
    console.log("Webhook Processing Error:", error);
    response.status(500).send("Internal Server Error");
  }
};