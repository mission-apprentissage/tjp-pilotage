"use client";

import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

import { client } from "@/api.client";
import { IntentionSpinner } from "@/app/(wrapped)/intentions/saisie/components/IntentionSpinner";
import { IntentionForm } from "@/app/(wrapped)/intentions/saisie/intentionForm/IntentionForm";
import { GuardExpe } from '@/utils/security/GuardExpe';
import { GuardPermission } from "@/utils/security/GuardPermission";

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default () => {

  const { data: defaultCampagne, isLoading } = client.ref("[GET]/demande/campagne/default").useQuery({});

  return (
    <GuardPermission permission="intentions/ecriture">
      <GuardExpe isExpeRoute={false}>
        {isLoading && (<IntentionSpinner />)}
        {!isLoading && defaultCampagne &&  (
          <IntentionForm
            disabled={defaultCampagne?.statut !== CampagneStatutEnum["en cours"]}
            defaultValues={{
              campagneId: defaultCampagne?.id,
              rentreeScolaire: defaultCampagne?.annee ? Number.parseInt(defaultCampagne?.annee) + 1 : undefined,
            }}
            formMetadata={{}}
            campagne={defaultCampagne}
          />
        )}
      </GuardExpe>
    </GuardPermission>
  );
};
