import { headers } from "next/headers";

import { client } from "../../../../api.client";
import { PanoramaFormationClient } from "./client";

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

export default async function Panorama() {
  const defaultNsf = await fetchDefaultNsf();

  return <PanoramaFormationClient defaultNsf={defaultNsf} />;
}
