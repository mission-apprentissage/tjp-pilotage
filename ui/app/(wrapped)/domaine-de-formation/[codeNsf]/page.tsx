import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { client } from "@/api.client";

import { PageDomaineDeFormationClient } from "./client";
import { Filters, QueryFilters } from "./types";

type Params = {
  params: Promise<{
    codeNsf: string;
  }>;
  searchParams: Promise<Partial<Filters>>;
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

const fetchNsf = async (codeNsf: string, filters: QueryFilters) => {
  const headersList = Object.fromEntries(headers().entries());
  try {
    return await client
      .ref("[GET]/domaine-de-formation/:codeNsf")
      .query({ params: { codeNsf }, query: filters }, { headers: headersList });
  } catch (e) {
    return null;
  }
};

export default async function PageDomaineDeFormation({
  params,
  searchParams,
}: Params) {
  const { codeNsf } = await params;
  const { codeRegion, codeAcademie, codeDepartement, cfd } = await searchParams;
  const results = await fetchNsf(codeNsf, {
    codeRegion,
    codeAcademie,
    codeDepartement,
  });
  const nsfs = await fetchListOfNsfs();

  if (!results) {
    return notFound();
  }

  console.log("fetch from backend");

  return (
    <PageDomaineDeFormationClient
      libelleNsf={results.libelleNsf}
      codeNsf={codeNsf}
      filters={results.filters}
      nsfs={nsfs}
      defaultFormations={results.formations}
      cfd={cfd ?? results.formations.find((f) => f.nbEtab > 0)?.cfd ?? ""}
    />
  );
}
