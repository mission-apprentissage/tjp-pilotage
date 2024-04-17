"use client";

import { client } from "@/api.client";
import { isSaisieDisabled } from "@/app/(wrapped)/intentions/saisie/utils/isSaisieDisabled";

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

  if (isLoading) return <IntentionSpinner />;
  return (
    <>
      {data && (
        <IntentionForm
          disabled={!data.canEdit || isSaisieDisabled()}
          formId={numero}
          defaultValues={data}
          formMetadata={data.metadata}
          campagne={data.campagne}
        />
      )}
    </>
  );
};
