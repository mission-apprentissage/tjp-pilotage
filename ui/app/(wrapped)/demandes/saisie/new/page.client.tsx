"use client";

import {redirect, useSearchParams} from 'next/navigation';

import {client} from '@/api.client';
import { DemandeForm } from "@/app/(wrapped)/demandes/saisie/demandeForm/DemandeForm";
import { DemandeFilesProvider } from "@/app/(wrapped)/demandes/saisie/demandeForm/observationsSection/filesSection/filesContext";
import { canCreateDemande } from "@/app/(wrapped)/demandes/utils/permissionsDemandeUtils";
import {Loading} from '@/components/Loading';
import { getRoutingAccessSaisieDemande } from "@/utils/getRoutingAccesDemande";
import { GuardSaisieDemande } from '@/utils/security/GuardSaisieDemande';
import { useAuth } from "@/utils/security/useAuth";
import { useCurrentCampagne } from "@/utils/security/useCurrentCampagne";

export const PageClient = () => {
  const { user } = useAuth();
  const { campagne: currentCampagne } = useCurrentCampagne();
  const queryParams = useSearchParams();

  if(!currentCampagne) return redirect(getRoutingAccessSaisieDemande({user}));
  const campagneId = queryParams.get("campagneId") ?? currentCampagne.id;

  const { data: campagne, isLoading } = client.ref("[GET]/campagne/:campagneId").useQuery({
    params: { campagneId },
  });

  if(isLoading) return <Loading />;
  if(!campagne) return redirect(getRoutingAccessSaisieDemande({user}));

  return (
    <GuardSaisieDemande campagne={campagne}>
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
    </GuardSaisieDemande>
  );
};

