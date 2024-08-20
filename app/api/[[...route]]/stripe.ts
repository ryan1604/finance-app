import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db/drizzle";
import { userSubscription } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { checkSubscription } from "@/lib/subscription";

const settingsUrl = `${process.env.NEXT_PUBLIC_APP_URL}/settings`;

const app = new Hono()
  .get(
    "/subscription/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      try {
        const auth = getAuth(c);
        const { id } = c.req.valid("param");

        if (!id) {
          return c.json({ error: "missing id" }, 400);
        }

        if (!auth?.userId) {
          return c.json({ error: "unauthorised" }, 401);
        }

        const [data] = await db
          .select({
            userId: userSubscription.userId,
            stripeCustomerId: userSubscription.stripeCustomerId,
          })
          .from(userSubscription)
          .where(eq(userSubscription.userId, auth.userId));

        if (data?.userId && data?.stripeCustomerId) {
          const stripeSession = await stripe.billingPortal.sessions.create({
            customer: data.stripeCustomerId,
            return_url: settingsUrl,
          });

          return c.json({ url: stripeSession.url });
        }

        if (id === "monthly") {
          const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            mode: "subscription",
            line_items: [
              {
                price: "price_1PolidBZ9CTqgJYfLr12Yil4",
                quantity: 1,
              },
            ],
            metadata: {
              userId: auth.userId,
            },
          });

          return c.json({ url: stripeSession.url });
        }

        const stripeSession = await stripe.checkout.sessions.create({
          success_url: settingsUrl,
          cancel_url: settingsUrl,
          mode: "subscription",
          line_items: [
            {
              price: "price_1PoljCBZ9CTqgJYfeyrDlhdE",
              quantity: 1,
            },
          ],
          metadata: {
            userId: auth.userId,
          },
        });

        return c.json({ url: stripeSession.url });
      } catch (error: any) {
        console.log("[Stripe error]:", error);
        return c.json({ error: "Internal error" }, 500);
      }
    }
  )
  .get("/subscription", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    let isPro = false;

    if (!auth?.userId) {
      return c.json({ isPro });
    }

    isPro = await checkSubscription(auth.userId);

    return c.json({ isPro });
  });

export default app;
