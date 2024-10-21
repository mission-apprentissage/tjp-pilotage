import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { client } from "@/api.client";

import { PageDomaineDeFormationClient } from "./client";

type Params = {
  params: {
    codeNsf: string;
  };
};

const fetchListOfNsfs = async () => {
  const headersList = Object.fromEntries(headers().entries());
  try {
    return await client
      .ref("[GET]/domaine-de-formation")
      .query({ query: { search: undefined } }, { headers: headersList });
  } catch (e) {
    return [];
  }
};

const fetchNsf = async (codeNsf: string) => {
  const headersList = Object.fromEntries(headers().entries());
  try {
    return await client
      .ref("[GET]/domaine-de-formation/:codeNsf")
      .query({ params: { codeNsf } }, { headers: headersList });
  } catch (e) {
    return null;
  }
};

export default async function PageDomaineDeFormation({
  params: { codeNsf },
}: Params) {
  const results = await fetchNsf(codeNsf);
  const nsfs = await fetchListOfNsfs();

  if (!results) {
    return notFound();
  }

  return (
    <PageDomaineDeFormationClient
      libelleNsf={results.libelleNsf}
      codeNsf={codeNsf}
      filters={results.filters}
      nsfs={nsfs}
    />
  );
}
