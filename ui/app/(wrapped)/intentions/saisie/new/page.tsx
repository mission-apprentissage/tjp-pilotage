"use client";

import { useSearchParams } from "next/navigation";

import { client } from "../../../../../api.client";
import { GuardPermission } from "../../../../../utils/security/GuardPermission";
import { IntentionSpinner } from "../components/IntentionSpinner";
import { IntentionForm } from "../intentionForm/IntentionForm";
export default () => {
  const queryParams = useSearchParams();
  const numero = queryParams.get("numero");

  const { data, isLoading } = client.ref("[GET]/demande/:numero").useQuery(
    { params: { numero: numero ?? "" } },
    {
      enabled: !!numero,
      cacheTime: 0,
    }
  );

  if (isLoading && !!numero) return <IntentionSpinner />;
  return (
    <GuardPermission permission="intentions/ecriture">
      {numero ? (
        data && (
          <IntentionForm
            disabled={false}
            defaultValues={{
              cfd: data?.compensationCfd,
              codeDispositif: data?.compensationCodeDispositif,
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
