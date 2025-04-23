"use client";

import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";

import { client } from "@/api.client";
import { DemandeSpinner } from "@/app/(wrapped)/demandes/saisie/components/DemandeSpinner";
import { DemandeForm } from "@/app/(wrapped)/demandes/saisie/demandeForm/DemandeForm";
import { DemandeFilesProvider } from "@/app/(wrapped)/demandes/saisie/demandeForm/observationsSection/filesSection/filesContext";
import { canEditDemande } from '@/app/(wrapped)/demandes/utils/permissionsDemandeUtils';
import { getRoutingSaisieRecueilDemande } from "@/utils/getRoutingRecueilDemande";
import { GuardSaisieExpe } from "@/utils/security/GuardSaisieExpe";
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

  const { data: demande, isLoading } = client.ref("[GET]/demande/:numero").useQuery(
    { params: { numero: numero } },
    {
      cacheTime: 0,
      onError: (error: unknown) => {
        if (isAxiosError(error) && error.response?.data?.message) {
          console.error(error);
          if (error.response?.status === 404) push(`${getRoutingSaisieRecueilDemande({ user })}?notfound=${numero}`);
        }
      },
    }
  );

  if (isLoading || !demande) return <DemandeSpinner />;

  return (
    <GuardSaisieExpe campagne={demande.campagne}>
      <DemandeFilesProvider numero={numero}>
        <DemandeForm
          disabled={!canEditDemande({demande, user})}
          formId={numero}
          defaultValues={demande}
          demande={demande}
          formMetadata={demande.metadata}
          campagne={demande.campagne}
        />
      </DemandeFilesProvider>
    </GuardSaisieExpe>
  );
};
