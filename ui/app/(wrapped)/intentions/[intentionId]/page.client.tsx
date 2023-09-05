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
          defaultValues={{
            1: { uai: data.uai },
            2: {
              ...data,
              amiCma: JSON.stringify(data.amiCma),
              poursuitePedagogique: JSON.stringify(data.poursuitePedagogique),
              coloration:
                data.libelleColoration === undefined
                  ? undefined
                  : data.libelleColoration
                  ? "true"
                  : "false",
            },
          }}
        />
      )}
    </>
  );
};
