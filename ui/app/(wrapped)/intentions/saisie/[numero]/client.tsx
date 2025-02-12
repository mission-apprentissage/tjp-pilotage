"use client";

import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";

import { client } from "@/api.client";
import { IntentionSpinner } from "@/app/(wrapped)/intentions/saisie/components/IntentionSpinner";
import { IntentionForm } from "@/app/(wrapped)/intentions/saisie/intentionForm/IntentionForm";
import {canEditDemandeIntention} from '@/app/(wrapped)/intentions/utils/permissionsIntentionUtils';
import { getRoutingSaisieRecueilDemande } from "@/utils/getRoutingRecueilDemande";
import { useAuth } from "@/utils/security/useAuth";
import { useCurrentCampagne } from "@/utils/security/useCurrentCampagne";

export const PageClient = ({
  params: { numero },
}: {
  params: {
    numero: string;
  };
}) => {
  const { user } = useAuth();
  const { push } = useRouter();
  const { campagne } = useCurrentCampagne();
  const { data: demande, isLoading } = client.ref("[GET]/demande/:numero").useQuery(
    { params: { numero: numero } },
    {
      cacheTime: 0,
      onError: (error: unknown) => {
        if (isAxiosError(error) && error.response?.data?.message) {
          console.error(error);
          if (error.response?.status === 404) push(`${getRoutingSaisieRecueilDemande({user, campagne})}?notfound=${numero}`);
        }
      },
    }
  );

  if (isLoading || !demande) return <IntentionSpinner />;

  return (
    <IntentionForm
      disabled={!canEditDemandeIntention({ demandeIntention: demande, user })}
      formId={numero}
      defaultValues={demande}
      demande={demande}
      formMetadata={demande.metadata}
      campagne={demande.campagne}
    />
  );
};
