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
          formId={intentionId}
          defaultValues={{
            1: {
              uai: data.uai,
              cfd: data.cfd,
              dispositifId: data.dispositifId,
            },
            2: {
              motif: data.motif,
              typeDemande: data.typeDemande,
              autreMotif: data.autreMotif,
              commentaire: data.commentaire,
              libelleColoration: data.libelleColoration,
              amiCma: data.amiCma,
              poursuitePedagogique: data.poursuitePedagogique,
              rentreeScolaire: data.rentreeScolaire,
              coloration: data.coloration,
              capaciteScolaire: data.capaciteScolaire,
              capaciteApprentissage: data.capaciteApprentissage,
            },
          }}
          formMetadata={data.metadata}
        />
      )}
    </>
  );
};
