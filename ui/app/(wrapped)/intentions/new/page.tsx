"use client";

import { Center, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import qs from "qs";

import { api } from "../../../../api.client";
import { GuardPermission } from "../../../../utils/security/GuardPermission";
import { IntentionForm } from "../intentionForm/IntentionForm";
export default () => {
  const queryParams = useSearchParams();

  const searchParams: {
    intentionId?: string;
  } = qs.parse(queryParams.toString());

  const { data, isLoading } = useQuery({
    queryKey: [searchParams.intentionId],
    queryFn: api.getDemande({ params: { id: searchParams.intentionId ?? "" } })
      .call,
    cacheTime: 0,
  });

  if (isLoading)
    return (
      <Center mt="6">
        <Spinner />
      </Center>
    );
  return (
    <GuardPermission permission="intentions/envoi">
      {searchParams.intentionId ? (
        data && (
          <IntentionForm
            defaultValues={{
              cfd: data?.compensationCfd,
              dispositifId: data?.compensationDispositifId,
              uai: data?.compensationUai,
              rentreeScolaire: data?.compensationRentreeScolaire,
            }}
            formMetadata={{
              etablissement: data?.metadata?.etablissementCompensation,
              formation: data?.metadata?.formationCompensation,
            }}
          />
        )
      ) : (
        <IntentionForm defaultValues={{}} formMetadata={{}} />
      )}
    </GuardPermission>
  );
};
