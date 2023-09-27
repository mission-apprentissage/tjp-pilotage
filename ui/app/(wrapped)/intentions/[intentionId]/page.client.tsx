"use client";

import { Center, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { api } from "../../../../api.client";
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

  if (isLoading)
    return (
      <Center mt="6">
        <Spinner />
      </Center>
    );
  return (
    <>
      {data && (
        <IntentionForm
          formId={intentionId}
          defaultValues={data}
          formMetadata={data.metadata}
        />
      )}
    </>
  );
};
