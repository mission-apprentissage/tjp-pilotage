import { isAxiosError } from "axios";
import { headers } from "next/headers";

import { serverClient } from "@/api.client";

import { PanoramaDomaineDeFormationClient } from "./client";

const fetchDefaultNsf = async () => {
  const headersList = Object.fromEntries(headers().entries());
  try {
    return await serverClient
      .ref("[GET]/domaine-de-formation")
      .query({ query: { search: undefined } }, { headers: headersList });
  } catch (e) {
    if (isAxiosError(e)) {
      console.error({ status: e.response?.status, message: e.response?.data });
    }

    return [];
  }
};

export default async function Panorama({ searchParams }: { searchParams: { wrongNsf?: string } }) {
  const defaultNsf = await fetchDefaultNsf();

  return <PanoramaDomaineDeFormationClient defaultNsf={defaultNsf} wrongNsf={searchParams.wrongNsf} />;
}
