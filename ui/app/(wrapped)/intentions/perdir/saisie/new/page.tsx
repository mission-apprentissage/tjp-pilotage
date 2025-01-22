"use client";

import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

import { client } from "@/api.client";
import { IntentionForm } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/IntentionForm";
import { IntentionFilesProvider } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/observationsSection/filesSection/filesContext";
import { GuardPermission } from "@/utils/security/GuardPermission";

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default () => {
  const { data: currentCampagne } = client.ref("[GET]/campagne/current").useQuery({});

  return (
    <GuardPermission permission="intentions-perdir/ecriture">
      <IntentionFilesProvider>
        <IntentionForm
          disabled={currentCampagne?.statut !== CampagneStatutEnum["en cours"]}
          defaultValues={{
            campagneId: currentCampagne?.id,
          }}
          formMetadata={{}}
          campagne={currentCampagne}
        />
      </IntentionFilesProvider>
    </GuardPermission>
  );
};
