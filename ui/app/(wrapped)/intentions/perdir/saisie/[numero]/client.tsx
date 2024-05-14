"use client";

import { client } from "@/api.client";

import { IntentionSpinner } from "../components/IntentionSpinner";
import { IntentionForm } from "../intentionForm/IntentionForm";
import { IntentionFilesProvider } from "../intentionForm/observationsSection/filesSection/filesContext";
import { isSaisieDisabled } from "../utils/isSaisieDisabled";

export default ({
  params: { numero },
}: {
  params: {
    numero: string;
  };
}) => {
  const { data, isLoading } = client.ref("[GET]/intention/:numero").useQuery(
    { params: { numero: numero } },
    {
      cacheTime: 0,
    }
  );

  if (isLoading) return <IntentionSpinner />;
  return (
    <>
      {data && (
        <IntentionFilesProvider numero={numero}>
          <IntentionForm
            disabled={!data.canEdit || isSaisieDisabled()}
            formId={numero}
            defaultValues={data}
            formMetadata={data.metadata}
            campagne={data.campagne}
          />
        </IntentionFilesProvider>
      )}
    </>
  );
};