"use client";

import type { ScopeZone } from "shared";

import { FiltersSection } from "./components/FiltersSection/FiltersSection";
import { FormationSection } from "./components/FormationSection";
import { HeaderSection } from "./components/HeaderSection/HeaderSection";
import { LiensUtilesSection } from "./components/LiensUtilesSection/LiensUtilesSection";
import { FormationContextProvider } from "./context/formationContext";
import type {
  Academie,
  Departement,
  DomaineDeFormationFilters,
  FormationListItem,
  FormationsCounter,
  NsfOptions,
  Region,
} from "./types";

type Props = {
  codeNsf: string;
  libelleNsf: string;
  filters: DomaineDeFormationFilters;
  nsfs: NsfOptions;
  formations: FormationListItem[];
  cfd: string;
  regions: Region[];
  academies: Academie[];
  departements: Departement[];
  scope: ScopeZone;
  counter: FormationsCounter;
};

export const PageDomaineDeFormationClient = ({
  codeNsf,
  libelleNsf,
  formations,
  cfd,
  regions,
  academies,
  departements,
  counter,
  scope,
}: Props) => {
  return (
    <FormationContextProvider value={{ codeNsf, cfd, scope, regions, academies, departements }}>
      <HeaderSection codeNsf={codeNsf} libelleNsf={libelleNsf} />
      <FiltersSection regionOptions={regions} academieOptions={academies} departementOptions={departements} />
      <FormationSection formations={formations} counter={counter} />
      <LiensUtilesSection />
    </FormationContextProvider>
  );
};
