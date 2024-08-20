"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SubscriptionButton } from "@/components/subscription-button";
import { useGetSubscription } from "@/features/stripe/api/use-get-subscription";

const SettingsPage = () => {
  const { data: isPro } = useGetSubscription();

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Separator className="mb-6" />
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="space-y-2 lg:space-y-0 lg:flex lg:items-center">
              <span className="font-bold block lg:inline">Bank account</span>
              <p className="text-sm text-muted-foreground lg:pl-32">No bank account connected</p>
            </div>
            <Button variant="secondary" className="w-full lg:w-auto" disabled={true}>
              Connect
            </Button>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="space-y-2 lg:space-y-0 lg:flex lg:items-center">
              <span className="font-bold block lg:inline">Subscription</span>
              <p className="text-sm text-muted-foreground lg:pl-32 lg:ml-1.5">
                {isPro ? "You are currently subscribed" : "You are not subscribed"}
              </p>
            </div>
            <SubscriptionButton isPro={isPro || false} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
