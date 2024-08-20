import { Check } from "lucide-react";
import { useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { useGetPaymentUrl } from "@/features/stripe/api/use-get-payment-url";
import { toast } from "sonner";
import { useOpenSubscription } from "@/features/stripe/hooks/use-open-subscription";
import { cn } from "@/lib/utils";

const settingsUrl = `${process.env.NEXT_PUBLIC_APP_URL}/settings`;

const proFeatures = [
  "Unlock ability to import CSV files.",
  "Unlock Line Chart",
  "Unlock Bar Chart",
  "Unlock Radar Chart",
  "Unlock Radial Chart",
];

type Props = {
  name: string;
};

export const ProModel = ({ name }: Props) => {
  const [loading, setLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState("monthly");

  const { data: paymentUrl, refetch } = useGetPaymentUrl(paymentMode);

  const { isOpen, onOpen, onClose } = useOpenSubscription();

  const onClick = async () => {
    try {
      setLoading(true);
      console.log(paymentMode);
      const res = await refetch();

      if (res.status === "success") {
        window.location.href = res.data || settingsUrl;
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="default"
        className={cn("w-full lg:w-auto", name === "" && "bg-transparent")}
        disabled={name === "" ? true : loading}
        size={name === "Import" ? "sm" : "default"}
        onClick={onOpen}
      >
        {name}
      </Button>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose a subscription plan</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="monthly" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly" onClick={() => setPaymentMode("monthly")}>
                Monthly
              </TabsTrigger>
              <TabsTrigger value="yearly" onClick={() => setPaymentMode("yearly")}>
                Yearly (SAVE 17%)
              </TabsTrigger>
            </TabsList>
            <div className="my-4">
              <TabsContent value="monthly">
                <h1 className="text-5xl tracking-tight font-extrabold">$9.99</h1>
                <p className="text-muted-foreground">/month</p>
              </TabsContent>
              <TabsContent value="yearly">
                <h1 className="text-5xl tracking-tight font-extrabold">$99.99</h1>
                <p className="text-muted-foreground">/year</p>
              </TabsContent>
            </div>
            {proFeatures.map((feature, index) => (
              <div className="flex items-center my-2" key={index}>
                <Check className="mr-2 text-muted-foreground" />
                {feature}
              </div>
            ))}
          </Tabs>
          <div>
            <Button variant={"default"} className="w-full" onClick={onClick} disabled={loading}>
              Upgrade
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
