"use client";

import { useSearchParams } from "next/navigation";

import { client } from "../../../../../api.client";
import { GuardPermission } from "../../../../../utils/security/GuardPermission";
import { IntentionSpinner } from "../components/IntentionSpinner";
import { IntentionForm } from "../intentionForm/IntentionForm";
export default () => {
  const queryParams = useSearchParams();
  const intentionId = queryParams.get("intentionId");

  const { data, isLoading } = client.ref("[GET]/demande/:id").useQuery(
    { params: { id: intentionId ?? "" } },
    {
      enabled: !!intentionId,
      cacheTime: 0,
    }
  );

  if (isLoading && !!intentionId) return <IntentionSpinner />;
  return (
    <GuardPermission permission="intentions/ecriture">
      {intentionId ? (
        data && (
          <IntentionForm
            disabled={false}
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
        <IntentionForm disabled={false} defaultValues={{}} formMetadata={{}} />
      )}
    </GuardPermission>
  );
};
