"use client";


import { redirect } from "next/navigation";

import { IntentionForm } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/IntentionForm";
import { IntentionFilesProvider } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/observationsSection/filesSection/filesContext";
import { canCreateIntention } from "@/app/(wrapped)/intentions/utils/permissionsIntentionUtils";
import { getRoutingSaisieRecueilDemande } from "@/utils/getRoutingRecueilDemande";
import { GuardExpe } from '@/utils/security/GuardExpe';
import { GuardPermission } from "@/utils/security/GuardPermission";
import { useAuth } from "@/utils/security/useAuth";
import { useCurrentCampagne } from "@/utils/security/useCurrentCampagne";

const Page = () => {
  const { campagne } = useCurrentCampagne();
  const { user } = useAuth();
  if(!campagne) return redirect(getRoutingSaisieRecueilDemande({campagne, user}));

  return (
    <GuardPermission permission="intentions-perdir/ecriture">
      <GuardExpe isExpeRoute={true}>
        <IntentionFilesProvider>
          <IntentionForm
            disabled={!canCreateIntention({ user, campagne })}
            defaultValues={{
              campagneId: campagne.id,
              rentreeScolaire: Number.parseInt(campagne.annee) + 1,
            }}
            formMetadata={{}}
            campagne={campagne}
          />
        </IntentionFilesProvider>
      </GuardExpe>
    </GuardPermission>
  );
};

export default Page;
