"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "../../../../api.client";
import { IntentionSpinner } from "../components/IntentionSpinner";
import { IntentionForm } from "../intentionForm/IntentionForm";

export default ({
  params: { intentionId },
}: {
  params: {
    intentionId: string;
  };
}) => {
  const { data, isLoading } = useQuery({
    queryKey: [intentionId],
    queryFn: api.getDemande({ params: { id: intentionId } }).call,
    cacheTime: 0,
  });

  if (isLoading) return <IntentionSpinner />;
  return (
    <>
      {data && (
        <IntentionForm
          canEdit={data.canEdit}
          formId={intentionId}
          defaultValues={data}
          formMetadata={data.metadata}
        />
      )}
    </>
  );
};
