"use client";

import { isAxiosError } from "axios";
import {useRouter, useSearchParams} from 'next/navigation';

import { client } from "@/api.client";
import { DemandeSpinner } from "@/app/(wrapped)/demandes/saisie/components/DemandeSpinner";
import { DemandeForm } from "@/app/(wrapped)/demandes/saisie/demandeForm/DemandeForm";
import { DemandeFilesProvider } from "@/app/(wrapped)/demandes/saisie/demandeForm/observationsSection/filesSection/filesContext";
import { canEditCfdUai, canEditDemande } from '@/app/(wrapped)/demandes/utils/permissionsDemandeUtils';
import { getRoutingAccessSaisieDemande } from "@/utils/getRoutingAccesDemande";
import { GuardSaisieDemande } from "@/utils/security/GuardSaisieDemande";
import { useAuth } from "@/utils/security/useAuth";

export const PageClient = ({
  params: { numero },
}: {
  params: {
    numero: string;
  };
}) => {
  const { push } = useRouter();
  const { user } = useAuth();
  const queryParams = useSearchParams();

  const { data: demande, isLoading } = client.ref("[GET]/demande/:numero").useQuery(
    { params: { numero: numero } },
    {
      cacheTime: 0,
      onError: (error: unknown) => {
        if (isAxiosError(error) && error.response?.data?.message) {
          console.error(error);
          if (error.response?.status === 404) push(`${getRoutingAccessSaisieDemande({ user, campagne: demande?.campagne })}?notfound=${numero}`);
        }
      },
    }
  );


  if (isLoading || !demande) return <DemandeSpinner />;
  const isAdjustDemande = queryParams.get("editCfdUai") === "true" && canEditCfdUai({ demande, user });

  const isDisabled = !(canEditDemande({ demande, user }) || isAdjustDemande);

  return (
    <GuardSaisieDemande campagne={demande.campagne}>
      <DemandeFilesProvider numero={numero}>
        <DemandeForm
          disabled={isDisabled}
          formId={numero}
          defaultValues={demande}
          demande={demande}
          formMetadata={demande.metadata}
          campagne={demande.campagne}
        />
      </DemandeFilesProvider>
    </GuardSaisieDemande>
  );
};
