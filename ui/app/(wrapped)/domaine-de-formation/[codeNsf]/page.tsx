import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { client } from "@/api.client";

import { PageDomaineDeFormationClient } from "./client";
import { Filters, FormationListItem, QueryFilters } from "./types";

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

const findDefaultCfd = (
  defaultCfd: string | undefined,
  formations: FormationListItem[]
): string => {
  return (
    defaultCfd ??
    formations.filter((f) => f.scolaire).sort((a, b) => b.nbEtab - a.nbEtab)[0]
      ?.cfd ??
    formations.sort((a, b) => b.nbEtab - a.nbEtab)[0]?.cfd ??
    ""
  );
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
    return redirect(`/panorama/domaine-de-formation?wrongNsf=${codeNsf}`);
  }

  return (
    <PageDomaineDeFormationClient
      libelleNsf={results.libelleNsf}
      codeNsf={codeNsf}
      filters={results.filters}
      nsfs={nsfs}
      defaultFormations={results.formations}
      cfd={findDefaultCfd(cfd, results.formations)}
    />
  );
}
