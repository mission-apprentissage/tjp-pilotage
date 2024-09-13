"use client";

import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { hasRole } from "shared";

import { client } from "@/api.client";
import { usePermission } from "@/utils/security/usePermission";

import { useAuth } from "../../../../../../utils/security/useAuth";
import { IntentionSpinner } from "../components/IntentionSpinner";
import { IntentionForm } from "../intentionForm/IntentionForm";
import { IntentionFilesProvider } from "../intentionForm/observationsSection/filesSection/filesContext";
import { canEditIntention } from "../utils/canEditIntention";

export default ({
  params: { numero },
}: {
  params: {
    numero: string;
  };
}) => {
  const { push } = useRouter();
  const { auth } = useAuth();
  const isPerdir = hasRole({
    user: auth?.user,
    role: "perdir",
  });
  const hasEditIntentionPermission = usePermission(
    "intentions-perdir/ecriture"
  );
  const { data: intention, isLoading } = client
    .ref("[GET]/intention/:numero")
    .useQuery(
      { params: { numero: numero } },
      {
        cacheTime: 0,
        onError: (error: unknown) => {
          if (isAxiosError(error) && error.response?.data?.message) {
            console.error(error);
            if (error.response?.status === 404)
              push(`/intentions/perdir/saisie?notfound=${numero}`);
          }
        },
      }
    );

  if (isLoading) return <IntentionSpinner />;

  return (
    <>
      {intention && (
        <IntentionFilesProvider numero={numero}>
          <IntentionForm
            disabled={
              !intention.canEdit ||
              !canEditIntention({
                intention,
                hasEditIntentionPermission,
                isPerdir,
              })
            }
            formId={numero}
            defaultValues={intention}
            formMetadata={intention.metadata}
            campagne={intention.campagne}
          />
        </IntentionFilesProvider>
      )}
    </>
  );
};
