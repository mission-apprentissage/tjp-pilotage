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

  const { data: defaultCampagne } = client
    .ref("[GET]/campagne/default")
    .useQuery({});

  if (isLoading && !!numero) return <IntentionSpinner />;
  return (
    <GuardPermission permission="intentions/ecriture">
      {numero ? (
        data && (
          <IntentionForm
            disabled={defaultCampagne?.statut !== "en cours"}
            defaultValues={{
              cfd: data?.compensationCfd,
              codeDispositif: data?.compensationCodeDispositif,
              uai: data?.compensationUai,
              rentreeScolaire: data?.compensationRentreeScolaire,
              campagneId: data?.campagneId,
            }}
            formMetadata={{
              etablissement: data?.metadata?.etablissementCompensation,
              formation: data?.metadata?.formationCompensation,
            }}
            campagne={defaultCampagne}
          />
        )
      ) : (
        <IntentionForm
          disabled={defaultCampagne?.statut !== "en cours"}
          defaultValues={{
            campagneId: defaultCampagne?.id,
          }}
          formMetadata={{}}
          campagne={defaultCampagne}
        />
      )}
    </GuardPermission>
  );
};
