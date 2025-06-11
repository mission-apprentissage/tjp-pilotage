"use client";

import _, { uniqBy } from "lodash";
import { createContext, useContext } from "react";

import type {
  DomaineDeFormationResult,
  DomaineDeFormationResultFormation,
  FormationListItem,
  FormationsCounter,
} from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/types";
import { useDomaineDeFormationSearchParams } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/useDomaineDeFormationSearchParams";

const groupFromationsByLibelleNiveauDiplome = (
  formations: FormationListItem[]
): Record<string, FormationListItem[]> => {
  return _.chain(formations)
    .orderBy("ordreFormation", "desc")
    .groupBy("libelleNiveauDiplome")
    .toPairs()
    .sortBy([0])
    .fromPairs()
    .mapValues((value) => value.sort((a, b) => a.libelleFormation.localeCompare(b.libelleFormation)))
    .value();
};

type InputDomaineDeFormationType = {
  domaineDeFormation: DomaineDeFormationResult;
  setDomaineDeFormation: (domaineDeFormation: DomaineDeFormationResult) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

type DomaineDeFormationType = InputDomaineDeFormationType & {
  setDomaineDeFormation: (domaineDeFormation: DomaineDeFormationResult) => void;
  counter: FormationsCounter,
    formations: FormationListItem[],
    formationsByPresence: FormationListItem[],
    formationsByVoie: FormationListItem[],
    formationsByLibelleNiveauDiplome: Record<string, FormationListItem[]>
};

type DomaineDeFormationProps = {
  children: React.ReactNode;
  value: InputDomaineDeFormationType;
};

const normalizeFormations = (formations: DomaineDeFormationResultFormation[]): FormationListItem[] => {
  const output: FormationListItem[] = [];

  formations.forEach((formation) => {
    const index = output.findIndex(f => f.cfd === formation.cfd);
    const { voie, ...formationWithoutVoie } = formation;

    if (index > -1) {
      output[index] = {
        ...output[index],
        apprentissage: output[index].apprentissage || formationWithoutVoie.apprentissage,
        scolaire: output[index].scolaire || formationWithoutVoie.scolaire,
        voies: [...output[index].voies, voie]
      };
    } else {
      output.push({
        ...formationWithoutVoie,
        voies: [voie]
      });
    }
  });

  return output;
};

export const DomaineDeFormation = createContext<DomaineDeFormationType>({} as DomaineDeFormationType);

export function DomaineDeFormationProvider({ children, value }: Readonly<DomaineDeFormationProps>) {
  const { domaineDeFormation, setDomaineDeFormation, isLoading, setIsLoading } = value;
  const { presence, voie } = useDomaineDeFormationSearchParams();

  const formations = normalizeFormations(
    domaineDeFormation.formations
      .filter((formation) => (presence === "dispensees" ? formation.nbEtab > 0 : true))
      .filter((formation) => (presence === "absentes" ? formation.nbEtab === 0 : true))
      .filter((formation) => (voie === "apprentissage" ? formation.apprentissage : true))
      .filter((formation) => (voie === "scolaire" ? formation.scolaire : true))
  );

  const formationsByPresence = normalizeFormations(
    domaineDeFormation.formations
      .filter((formation) => (presence === "dispensees" ? formation.nbEtab > 0 : true))
      .filter((formation) => (presence === "absentes" ? formation.nbEtab === 0 : true))
  );

  const formationsByVoie = normalizeFormations(
    domaineDeFormation.formations
      .filter((formation) => (voie === "apprentissage" ? formation.apprentissage : true))
      .filter((formation) => (voie === "scolaire" ? formation.scolaire : true))
  );

  const counter: FormationsCounter = {
    inScope: formationsByVoie.filter((f) => f.nbEtab > 0).length,
    outsideScope: formationsByVoie.filter((f) => f.nbEtab === 0).length,
    scolaire: formationsByPresence.filter((f) => f.scolaire).length,
    apprentissage: formationsByPresence.filter((f) => f.apprentissage).length,
    allVoies: formationsByPresence.length,
    // dedupe cfd
    allScopes: uniqBy(domaineDeFormation.formations, "cfd").length,
  };

  const formationsByLibelleNiveauDiplome =
    groupFromationsByLibelleNiveauDiplome(formations);

  const context = {
    domaineDeFormation,
    setDomaineDeFormation,
    isLoading,
    setIsLoading,
    counter,
    formations,
    formationsByPresence,
    formationsByVoie,
    formationsByLibelleNiveauDiplome
  };

  return <DomaineDeFormation.Provider value={context}>{children}</DomaineDeFormation.Provider>;
}

export const useDomaineDeFormation = () => useContext(DomaineDeFormation);
