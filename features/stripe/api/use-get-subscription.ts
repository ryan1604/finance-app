import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetSubscription = () => {
  const query = useQuery({
    queryKey: ["stripe_subscription"],
    queryFn: async () => {
      const response = await client.api.stripe.subscription.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch subscriptions");
      }

      const { isPro } = await response.json();

      if (!isPro) {
        return false;
      }

      return isPro;
    },
  });

  return query;
};
