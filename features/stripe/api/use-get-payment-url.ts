import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetPaymentUrl = (paymentMode?: string) => {
  const query = useQuery({
    enabled: !!paymentMode,
    queryKey: ["stripe"],
    queryFn: async () => {
      const response = await client.api.stripe.subscription[":id"].$get({
        param: { id: paymentMode },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch subscriptions");
      }

      const { url } = await response.json();

      if (!url) {
        throw new Error("Failed to get url");
      }

      return url;
    },
  });

  return query;
};
