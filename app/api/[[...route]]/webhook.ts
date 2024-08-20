import { Hono } from "hono";
import Stripe from "stripe";

import { db } from "@/db/drizzle";
import { userSubscription } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { stripe } from "@/lib/stripe";

const app = new Hono().post("/", async (c) => {
  const body = await c.req.text();
  const signature = c.req.header("stripe-signature");

  if (!signature) {
    return c.json({}, 400);
  }

  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error: any) {
    return c.json({ webhook_error: `${error.message}` }, 400);
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    if (!session.metadata?.userId) {
      return c.json({ error: "User id is required" }, 400);
    }

    await db.insert(userSubscription).values({
      id: createId(),
      userId: session.metadata.userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: session.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    await db
      .update(userSubscription)
      .set({
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      })
      .where(eq(userSubscription.stripeSubscriptionId, subscription.id));
  }

  return c.json({}, 200);
});

export default app;
