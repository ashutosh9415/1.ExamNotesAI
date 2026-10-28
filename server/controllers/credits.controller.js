import Stripe from "stripe";
import UserModel from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key missing in .env");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const CREDIT_MAP = {
    100: 50,
    200: 120,
    500: 300,
};

export const createCreditsOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const { amount } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated",
            });
        }

        if (!CREDIT_MAP[amount]) {
            return res.status(400).json({
                message: "Invalid credit plan",
            });
        }

        if (!process.env.CREDIT_URL) {
            return res.status(500).json({
                message: "CREDIT_URL missing in .env",
            });
        }

       const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${process.env.CREDIT_URL}/payment-success`,
    cancel_url: `${process.env.CREDIT_URL}/payment-failed`,
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: `${CREDIT_MAP[amount]} Credits`,
                        },
                        unit_amount: Number(amount) * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId: userId.toString(),
                credits: CREDIT_MAP[amount].toString(),
            },
        });

        return res.status(200).json({
            url: session.url,
        });
    } catch (error) {
        console.error("Stripe order creation error:", error);

        return res.status(500).json({
            message: "Stripe order creation failed",
            error: error.message,
        });
    }
};

export const stripewebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            throw new Error("Stripe webhook secret missing in .env");
        }

        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("Stripe webhook signature error:", error.message);

        return res.status(400).send("Webhook Error");
    }

    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;

            const userId = session.metadata?.userId;
            const creditsToAdd = Number(session.metadata?.credits);

            if (!userId || !Number.isFinite(creditsToAdd) || creditsToAdd <= 0) {
                return res.status(400).json({
                    message: "Invalid metadata",
                });
            }

            await UserModel.findByIdAndUpdate(
                userId,
                {
                    $inc: {
                        credits: creditsToAdd,
                    },
                    $set: {
                        isCreditAvailable: true,
                    },
                },
                {
                    new: true,
                }
            );
        }

        return res.json({
            received: true,
        });
    } catch (error) {
        console.error("Stripe webhook processing error:", error);

        return res.status(500).json({
            message: "Webhook processing failed",
        });
    }
};

