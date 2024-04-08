"use client";

import { isSaisieDisabled } from "@/app/(wrapped)/intentions/saisie/utils/isSaisieDisabled";

import { client } from "../../../../../api.client";
import { IntentionSpinner } from "../components/IntentionSpinner";
import { IntentionForm } from "../intentionForm/IntentionForm";

export default ({
  params: { intentionId },
}: {
  params: {
    intentionId: string;
  };
}) => {
  const { data, isLoading } = client.ref("[GET]/demande/:id").useQuery(
    { params: { id: intentionId } },
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
          formId={intentionId}
          defaultValues={data}
          formMetadata={data.metadata}
        />
      )}
    </>
  );
};
