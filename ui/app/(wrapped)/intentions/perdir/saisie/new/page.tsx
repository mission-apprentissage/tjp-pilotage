"use client";

import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

import { client } from "@/api.client";
import { IntentionSpinner } from "@/app/(wrapped)/intentions/perdir/saisie/components/IntentionSpinner";
import { IntentionForm } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/IntentionForm";
import { IntentionFilesProvider } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/observationsSection/filesSection/filesContext";
import { GuardExpe } from '@/utils/security/GuardExpe';
import { GuardPermission } from "@/utils/security/GuardPermission";

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default () => {
  const { data: defaultCampagne, isLoading } = client.ref("[GET]/campagne/expe/default").useQuery({});

  return (
    <GuardPermission permission="intentions-perdir/ecriture">
      <GuardExpe isExpeRoute={true}>
        <IntentionFilesProvider>
          {isLoading && <IntentionSpinner />}
          {!isLoading && defaultCampagne && (
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
        </IntentionFilesProvider>
      </GuardExpe>
    </GuardPermission>
  );
};
