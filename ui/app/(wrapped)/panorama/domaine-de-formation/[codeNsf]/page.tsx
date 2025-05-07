import { isAxiosError } from "axios";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { serverClient } from "@/api.client";

import { DomaineDeFormationClient } from "./page.client";
import type { Filters } from "./types";

const fetchDefaultNsfs = async () => {
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
  params: Promise<{
    codeNsf: string;
  }>;
  searchParams: Promise<Partial<Filters>>;
};

export default async function DomaineDeFormation({ params }: Readonly<Params>) {
  const { codeNsf } = await params;

  const defaultNsfs = await fetchDefaultNsfs();
  const nsf = defaultNsfs.find((nsf) => nsf.value === codeNsf);

  if (!nsf) {
    return redirect(`/panorama/domaine-de-formation?wrongNsf=${codeNsf}`);
  }

  return (
    <DomaineDeFormationClient defaultNsfs={defaultNsfs} nsf={nsf} />
  );
}
