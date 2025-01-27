"use client";

import { useSearchParams } from "next/navigation";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

import { client } from "@/api.client";
import { IntentionSpinner } from "@/app/(wrapped)/intentions/saisie/components/IntentionSpinner";
import { IntentionForm } from "@/app/(wrapped)/intentions/saisie/intentionForm/IntentionForm";
import {GuardExpe} from '@/utils/security/GuardExpe';
import { GuardPermission } from "@/utils/security/GuardPermission";

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
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

  const { data: currentCampagne } = client.ref("[GET]/campagne/current").useQuery({});

  if (isLoading && !!numero) return <IntentionSpinner />;

  return (
    <GuardPermission permission="intentions/ecriture">
      <GuardExpe isExpeRoute={false}>
        {numero ? (
          data && (
            <IntentionForm
              disabled={currentCampagne?.statut !== CampagneStatutEnum["en cours"]}
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
              campagne={currentCampagne}
            />
          )
        ) : (
          <IntentionForm
            disabled={currentCampagne?.statut !== CampagneStatutEnum["en cours"]}
            defaultValues={{
              campagneId: currentCampagne?.id,
              rentreeScolaire: currentCampagne?.annee ? Number.parseInt(currentCampagne?.annee) + 1 : undefined,
            }}
            formMetadata={{}}
            campagne={currentCampagne}
          />
        )}
      </GuardExpe>
    </GuardPermission>
  );
};
