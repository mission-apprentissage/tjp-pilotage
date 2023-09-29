"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { api } from "../../../../api.client";
import { GuardPermission } from "../../../../utils/security/GuardPermission";
import { IntentionSpinner } from "../components/IntentionSpinner";
import { IntentionForm } from "../intentionForm/IntentionForm";
export default () => {
  const queryParams = useSearchParams();
  const intentionId = queryParams.get("intentionId");

  const { data, isLoading } = useQuery({
    enabled: !!intentionId,
    queryKey: [intentionId],
    queryFn: api.getDemande({ params: { id: intentionId ?? "" } }).call,
    cacheTime: 0,
  });

  if (isLoading && !!intentionId) return <IntentionSpinner />;
  return (
    <GuardPermission permission="intentions/envoi">
      {intentionId ? (
        data && (
          <IntentionForm
            canEdit={true}
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
        <IntentionForm canEdit={true} defaultValues={{}} formMetadata={{}} />
      )}
    </GuardPermission>
  );
};
