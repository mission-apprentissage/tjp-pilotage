"use client";

import { client } from "@/api.client";

import { CorrectionSpinner } from "./components/CorrectionSpinner";
import { CorrectionForm } from "./correctionForm/CorrectionForm";

export default ({
  params: { numero },
}: {
  params: {
    numero: string;
  };
}) => {
  const { data: demande, isLoading } = client
    .ref("[GET]/demande/:numero")
    .useQuery(
      { params: { numero: numero ?? "" } },
      {
        enabled: !!numero,
        cacheTime: 0,
      }
    );

  const { data: defaultCampagne } = client
    .ref("[GET]/demande/campagne/default")
    .useQuery({});

  if (isLoading && !!numero) return <CorrectionSpinner />;
  return (
    <>
      {numero && demande && (
        <CorrectionForm demande={demande} campagne={defaultCampagne} />
      )}
    </>
  );
};
