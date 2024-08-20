import { Upload } from "lucide-react";
import { useCSVReader } from "react-papaparse";

import { Button } from "@/components/ui/button";
import { useGetSubscription } from "@/features/stripe/api/use-get-subscription";
import { ProModel } from "@/components/pro-model";

type Props = {
  onUpload: (results: any) => void;
};

export const UploadButton = ({ onUpload }: Props) => {
  const { CSVReader } = useCSVReader();
  const { data: isPro } = useGetSubscription();

  return (
    <div>
      {isPro ? (
        <CSVReader onUploadAccepted={onUpload}>
          {({ getRootProps }: any) => (
            <Button size="sm" className="w-full lg:w-auto" {...getRootProps()}>
              <Upload className="size-4 mr-2" />
              Import
            </Button>
          )}
        </CSVReader>
      ) : (
        <ProModel name={"Import"} />
      )}
    </div>
  );
};
