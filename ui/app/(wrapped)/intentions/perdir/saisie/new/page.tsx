"use client";

import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

import { client } from "@/api.client";
import { GuardPermission } from "@/utils/security/GuardPermission";

import { IntentionForm } from "../intentionForm/IntentionForm";
export default () => {
  const { data: defaultCampagne } = client
    .ref("[GET]/campagne/expe/default")
    .useQuery({});

  return (
    <GuardPermission permission="intentions/ecriture">
      <IntentionForm
        disabled={defaultCampagne?.statut !== CampagneStatutEnum["en cours"]}
        defaultValues={{
          campagneId: defaultCampagne?.id,
        }}
        formMetadata={{}}
        campagne={defaultCampagne}
      />
    </GuardPermission>
  );
};
