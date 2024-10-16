import { headers } from "next/headers";

import { client } from "../../../../api.client";
import { PanoramaDomaineDeFormationClient } from "./client";

const fetchDefaultNsf = async () => {
  const headersList = Object.fromEntries(headers().entries());
  try {
    return await client
      .ref("[GET]/domaine-de-formation")
      .query({ query: { search: undefined } }, { headers: headersList });
  } catch (e) {
    return [];
  }
};

export default async function Panorama({
  searchParams,
}: {
  searchParams: { wrongNsf?: string };
}) {
  const defaultNsf = await fetchDefaultNsf();

  return (
    <PanoramaDomaineDeFormationClient
      defaultNsf={defaultNsf}
      wrongNsf={searchParams.wrongNsf}
    />
  );
}
