"use client";

import {redirect} from 'next/navigation';

import { IntentionForm } from "@/app/(wrapped)/intentions/saisie/intentionForm/IntentionForm";
import {getRoutingSaisieRecueilDemande} from '@/utils/getRoutingRecueilDemande';
import {GuardExpe} from '@/utils/security/GuardExpe';
import { GuardPermission } from "@/utils/security/GuardPermission";
import {useAuth} from '@/utils/security/useAuth';
import {useCurrentCampagne} from '@/utils/security/useCurrentCampagne';

const Page = () => {
  const { campagne } = useCurrentCampagne();
  const { auth } = useAuth();

  if(!campagne) return redirect(getRoutingSaisieRecueilDemande({campagne, user: auth?.user}));

  return (
    <GuardPermission permission="intentions/ecriture">
      <GuardExpe isExpeRoute={false}>
        <IntentionForm
          defaultValues={{
            campagneId: campagne.id,
            rentreeScolaire:  Number.parseInt(campagne.annee) + 1,
          }}
          formMetadata={{}}
          campagne={campagne}
        />
      </GuardExpe>
    </GuardPermission>
  );
};

export default Page;
