import { isAxiosError } from "axios";
import { headers } from "next/headers";

import { serverClient } from "@/api.client";

import { PageClient } from "./page.client";

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

type Params = {
  searchParams: Promise<{ wrongNsf?: string }>;
};

export default async function Panorama({ searchParams }: Readonly<Params>) {
  const { wrongNsf } = await searchParams;
  const defaultNsf = await fetchDefaultNsf();

  return <PageClient defaultNsf={defaultNsf} wrongNsf={wrongNsf} />;
}
