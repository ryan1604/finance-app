"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { useGetPaymentUrl } from "@/features/stripe/api/use-get-payment-url";
import { ProModel } from "./pro-model";

type Props = {
  isPro: boolean;
};

const settingsUrl = `${process.env.NEXT_PUBLIC_APP_URL}/settings`;

export const SubscriptionButton = ({ isPro }: Props) => {
  const [loading, setLoading] = useState(false);

  const { data: paymentUrl, refetch } = useGetPaymentUrl("monthly");

  const onClick = async () => {
    try {
      setLoading(true);
      await refetch();

      window.location.href = paymentUrl || settingsUrl;
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isPro ? (
        <Button variant="default" className="w-full lg:w-auto" onClick={onClick} disabled={loading}>
          Manage Subscription
        </Button>
      ) : (
        <ProModel name="Manage Subscription" />
      )}
    </div>
  );
};
