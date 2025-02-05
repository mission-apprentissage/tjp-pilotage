"use client";

import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";

import { client } from "@/api.client";
import { IntentionSpinner } from "@/app/(wrapped)/intentions/perdir/saisie/components/IntentionSpinner";
import { IntentionForm } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/IntentionForm";
import { IntentionFilesProvider } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/observationsSection/filesSection/filesContext";
import { canEditIntention } from '@/app/(wrapped)/intentions/utils/permissionsIntentionUtils';
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
  const { push } = useRouter();
  const { auth } = useAuth();
  const { campagne } = useCurrentCampagne();

  const { data: intention, isLoading } = client.ref("[GET]/intention/:numero").useQuery(
    { params: { numero: numero } },
    {
      cacheTime: 0,
      onError: (error: unknown) => {
        if (isAxiosError(error) && error.response?.data?.message) {
          console.error(error);
          if (error.response?.status === 404) push(`${getRoutingSaisieRecueilDemande({user: auth?.user, campagne })}?notfound=${numero}`);
        }
      },
    }
  );

  if (isLoading || !intention) return <IntentionSpinner />;

  return (
    <IntentionFilesProvider numero={numero}>
      <IntentionForm
        disabled={!canEditIntention({intention, user: auth?.user})}
        formId={numero}
        defaultValues={intention}
        formMetadata={intention.metadata}
        campagne={intention.campagne}
      />
    </IntentionFilesProvider>
  );
};
