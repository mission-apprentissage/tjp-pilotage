"use client";

import {redirect, useSearchParams} from 'next/navigation';
import {PermissionEnum} from 'shared/enum/permissionEnum';

import {client} from '@/api.client';
import { DemandeForm } from "@/app/(wrapped)/demandes/saisie/demandeForm/DemandeForm";
import { DemandeFilesProvider } from "@/app/(wrapped)/demandes/saisie/demandeForm/observationsSection/filesSection/filesContext";
import { canCreateDemande } from "@/app/(wrapped)/demandes/utils/permissionsDemandeUtils";
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

  if(!currentCampagne) return redirect(getRoutingSaisieRecueilDemande({user}));
  const campagneId = queryParams.get("campagneId") ?? currentCampagne.id;

  const { data: campagne, isLoading } = client.ref("[GET]/campagne/:campagneId").useQuery({
    params: { campagneId },
  });

  if(isLoading) return <Loading />;
  if(!campagne) return redirect(getRoutingSaisieRecueilDemande({user}));

  return (
    <GuardPermission permission={PermissionEnum["demande/ecriture"]}>
      <GuardSaisieExpe campagne={campagne}>
        <DemandeFilesProvider>
          <DemandeForm
            disabled={!canCreateDemande({ user, campagne })}
            defaultValues={{
              campagneId,
              rentreeScolaire: Number.parseInt(campagne.annee) + 1,
            }}
            formMetadata={{}}
            campagne={campagne}
          />
        </DemandeFilesProvider>
      </GuardSaisieExpe>
    </GuardPermission>
  );
};

export default Page;
