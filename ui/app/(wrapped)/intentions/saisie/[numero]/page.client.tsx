"use client";

import { client } from "@/api.client";

import { IntentionSpinner } from "../components/IntentionSpinner";
import { IntentionForm } from "../intentionForm/IntentionForm";

export default ({
  params: { numero },
}: {
  params: {
    numero: string;
  };
}) => {
  const { data, isLoading } = client.ref("[GET]/demande/:numero").useQuery(
    { params: { numero: numero } },
    {
      cacheTime: 0,
    }
  );

  console.log(data, isLoading);

  if (isLoading) return <IntentionSpinner />;
  return (
    <>
      {data && (
        <IntentionForm
          disabled={!data.canEdit}
          formId={numero}
          defaultValues={data}
          formMetadata={data.metadata}
          campagne={data.campagne}
        />
      )}
    </>
  );
};
