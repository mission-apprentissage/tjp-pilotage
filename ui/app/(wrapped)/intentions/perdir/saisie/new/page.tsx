"use client";

import {redirect, useSearchParams} from 'next/navigation';

import {client} from '@/api.client';
import { IntentionForm } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/IntentionForm";
import { IntentionFilesProvider } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/observationsSection/filesSection/filesContext";
import { canCreateIntention } from "@/app/(wrapped)/intentions/utils/permissionsIntentionUtils";
import {Loading} from '@/components/Loading';
import { getRoutingSaisieRecueilDemande } from "@/utils/getRoutingRecueilDemande";
import { GuardExpe } from '@/utils/security/GuardExpe';
import { GuardPermission } from "@/utils/security/GuardPermission";
import { useAuth } from "@/utils/security/useAuth";
import { useCurrentCampagne } from "@/utils/security/useCurrentCampagne";

const Page = () => {
  const { user } = useAuth();
  const { campagne: currentCampagne } = useCurrentCampagne();
  const queryParams = useSearchParams();

  if(!currentCampagne) return redirect(getRoutingSaisieRecueilDemande({campagne: currentCampagne, user}));
  const campagneId = queryParams.get("campagneId") ?? currentCampagne.id;

  const { data: campagne, isLoading } = client.ref("[GET]/campagne/:campagneId").useQuery({
    params: { campagneId },
  });

  if(isLoading) return <Loading />;
  if(!campagne) return redirect(getRoutingSaisieRecueilDemande({campagne, user}));

  return (
    <GuardPermission permission="intentions-perdir/ecriture">
      <GuardExpe isExpeRoute={true}>
        <IntentionFilesProvider>
          <IntentionForm
            disabled={!canCreateIntention({ user, campagne, currentCampagne })}
            defaultValues={{
              campagneId,
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
