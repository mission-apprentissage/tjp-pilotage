"use client";

import {redirect, useSearchParams} from 'next/navigation';
import {PermissionEnum} from 'shared/enum/permissionEnum';

import {client} from '@/api.client';
import { IntentionForm } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/IntentionForm";
import { IntentionFilesProvider } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/observationsSection/filesSection/filesContext";
import { canCreateIntention } from "@/app/(wrapped)/intentions/utils/permissionsIntentionUtils";
import {Loading} from '@/components/Loading';
import { getRoutingSaisieRecueilDemande } from "@/utils/getRoutingRecueilDemande";
import { GuardPermission } from "@/utils/security/GuardPermission";
import { GuardSaisieExpe } from '@/utils/security/GuardSaisieExpe';
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
    <GuardPermission permission={PermissionEnum["intentions-perdir/ecriture"]}>
      <GuardSaisieExpe campagne={campagne}>
        <IntentionFilesProvider>
          <IntentionForm
            disabled={!canCreateIntention({ user, campagne })}
            defaultValues={{
              campagneId,
              rentreeScolaire: Number.parseInt(campagne.annee) + 1,
            }}
            formMetadata={{}}
            campagne={campagne}
          />
        </IntentionFilesProvider>
      </GuardSaisieExpe>
    </GuardPermission>
  );
};

export default Page;
