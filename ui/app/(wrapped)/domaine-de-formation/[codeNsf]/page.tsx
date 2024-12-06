import { isAxiosError } from "axios";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ScopeEnum } from "shared";

import { serverClient } from "@/api.client";

import { PageDomaineDeFormationClient } from "./client";
import type { Filters, FormationListItem, FormationsCounter, QueryFilters } from "./types";

export const dynamic = "force-dynamic";

const fetchNsf = async (codeNsf: string, filters: QueryFilters) => {
  const headersList = Object.fromEntries(headers().entries());
  try {
    return await serverClient
      .ref("[GET]/domaine-de-formation/:codeNsf")
      .query({ params: { codeNsf }, query: filters }, { headers: headersList });
  } catch (e) {
    if (isAxiosError(e)) {
      console.error({ status: e.response?.status, message: e.response?.data });
    }

    return null;
  }
};

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

const findDefaultCfd = (defaultCfd: string | undefined, formations: FormationListItem[]): string => {
  return (
    defaultCfd ??
    formations.filter((f) => f.scolaire).sort((a, b) => b.nbEtab - a.nbEtab)[0]?.cfd ??
    formations.sort((a, b) => b.nbEtab - a.nbEtab)[0]?.cfd ??
    ""
  );
};

const defineScope = (
  codeRegion: string | undefined,
  codeAcademie: string | undefined,
  codeDepartement: string | undefined
) => {
  if (codeDepartement) {
    return ScopeEnum.département;
  }

  if (codeAcademie) {
    return ScopeEnum.académie;
  }

  if (codeRegion) {
    return ScopeEnum.région;
  }

  return ScopeEnum.national;
};

type Params = {
  params: Promise<{
    codeNsf: string;
  }>;
  searchParams: Promise<Partial<Filters>>;
};

export default async function PageDomaineDeFormation({ params, searchParams }: Readonly<Params>) {
  const { codeNsf } = await params;
  const { codeRegion, codeAcademie, codeDepartement, cfd, presence, voie } = await searchParams;

  const results = await fetchNsf(codeNsf, {
    codeRegion,
    codeAcademie,
    codeDepartement,
  });

  const defaultNsfs = await fetchDefaultNsfs();

  if (!results) {
    return redirect(`/panorama/domaine-de-formation?wrongNsf=${codeNsf}`);
  }

  const regions = results.filters.regions;
  let academies = results.filters.academies;
  let departements = results.filters.departements;

  if (codeRegion) {
    academies = academies.filter((academie) => academie.codeRegion === codeRegion);
    departements = departements.filter((departement) => departement.codeRegion === codeRegion);

    if (codeAcademie) {
      departements = departements.filter((departement) => departement.codeAcademie === codeAcademie);
    }
  }

  const formations = results.formations
    .filter((formation) => (presence === "dispensees" ? formation.nbEtab > 0 : true))
    .filter((formation) => (presence === "absentes" ? formation.nbEtab === 0 : true))
    .filter((formation) => (voie === "apprentissage" ? formation.apprentissage : true))
    .filter((formation) => (voie === "scolaire" ? formation.scolaire : true));

  const formationsByPresence = results.formations
    .filter((formation) => (presence === "dispensees" ? formation.nbEtab > 0 : true))
    .filter((formation) => (presence === "absentes" ? formation.nbEtab === 0 : true));

  const formationsByVoie = results.formations
    .filter((formation) => (voie === "apprentissage" ? formation.apprentissage : true))
    .filter((formation) => (voie === "scolaire" ? formation.scolaire : true));

  const counter: FormationsCounter = {
    inScope: formationsByVoie.filter((f) => f.nbEtab > 0).length,
    outsideScope: formationsByVoie.filter((f) => f.nbEtab === 0).length,
    scolaire: formationsByPresence.filter((f) => f.scolaire).length,
    apprentissage: formationsByPresence.filter((f) => f.apprentissage).length,
    allVoies: formationsByPresence.length,
    allScopes: results.formations.length,
  };

  const scope = defineScope(codeRegion, codeAcademie, codeDepartement);

  const selectedCfd = findDefaultCfd(cfd, results.formations);

  return (
    <PageDomaineDeFormationClient
      libelleNsf={results.libelleNsf}
      codeNsf={codeNsf}
      formations={formations}
      cfd={selectedCfd}
      regions={regions}
      academies={academies}
      departements={departements}
      scope={scope}
      counter={counter}
      defaultNsfs={defaultNsfs}
    />
  );
}
