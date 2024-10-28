"use client";

import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";

import { client } from "@/api.client";
import { IntentionSpinner } from "@/app/(wrapped)/intentions/saisie/components/IntentionSpinner";
import { IntentionForm } from "@/app/(wrapped)/intentions/saisie/intentionForm/IntentionForm";
import { isSaisieDisabled } from "@/app/(wrapped)/intentions/saisie/utils/isSaisieDisabled";

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default ({
  params: { numero },
}: {
  params: {
    numero: string;
  };
}) => {
  const { push } = useRouter();
  const { data, isLoading } = client.ref("[GET]/demande/:numero").useQuery(
    { params: { numero: numero } },
    {
      cacheTime: 0,
      onError: (error: unknown) => {
        if (isAxiosError(error) && error.response?.data?.message) {
          console.error(error);
          if (error.response?.status === 404) push(`/intentions/saisie?notfound=${numero}`);
        }
      },
    }
  );

  if (isLoading) return <IntentionSpinner />;
  return (
    <>
      {data && (
        <IntentionForm
          disabled={!data.canEdit || isSaisieDisabled()}
          formId={numero}
          defaultValues={data}
          demande={data}
          formMetadata={data.metadata}
          campagne={data.campagne}
        />
      )}
    </>
  );
};
