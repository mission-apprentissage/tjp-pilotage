"use client";

import type { ScopeZone } from "shared";

import { FiltersSection } from "./components/FiltersSection/FiltersSection";
import { FormationSection } from "./components/FormationSection";
import { HeaderSection } from "./components/HeaderSection/HeaderSection";
import { LiensUtilesSection } from "./components/LiensUtilesSection/LiensUtilesSection";
import { FormationContextProvider } from "./context/formationContext";
import type { Academie, Departement, FormationListItem, FormationsCounter, NsfOptions, Region } from "./types";

type Props = {
  codeNsf: string;
  libelleNsf: string;
  formations: FormationListItem[];
  cfd: string;
  regions: Region[];
  academies: Academie[];
  departements: Departement[];
  scope: ScopeZone;
  counter: FormationsCounter;
  defaultNsfs: NsfOptions;
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
  defaultNsfs,
}: Props) => {
  return (
    <FormationContextProvider value={{ codeNsf, scope, regions, academies, departements, libelleNsf }} defaultCfd={cfd}>
      <HeaderSection codeNsf={codeNsf} libelleNsf={libelleNsf} />
      <FiltersSection
        regionOptions={regions}
        academieOptions={academies}
        departementOptions={departements}
        defaultNsfs={defaultNsfs}
        currentNsf={codeNsf}
      />
      <FormationSection formations={formations} counter={counter} />
      <LiensUtilesSection />
    </FormationContextProvider>
  );
};
