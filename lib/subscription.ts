import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { userSubscription as userSubscriptionSchema } from "@/db/schema";

export const checkSubscription = async (userId: string) => {
  const [userSubscription] = await db
    .select({
      stripeCurrentPeriodEnd: userSubscriptionSchema.stripeCurrentPeriodEnd,
      stripePriceId: userSubscriptionSchema.stripePriceId,
    })
    .from(userSubscriptionSchema)
    .where(eq(userSubscriptionSchema.userId, userId));

  if (!userSubscription) {
    return false;
  }

  const isValid = userSubscription.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime()! > Date.now();

  return !!isValid;
};
