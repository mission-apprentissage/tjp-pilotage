"use client";

import _ from "lodash";
import { createContext, useContext } from "react";

import { useDomaineDeFormationSearchParams } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/client";
import type {
  DomaineDeFormationResult,
  FormationListItem,
  FormationsCounter,
} from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/types";

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

export const DomaineDeFormation = createContext<DomaineDeFormationType>({} as DomaineDeFormationType);

export function DomaineDeFormationProvider({ children, value }: Readonly<DomaineDeFormationProps>) {
  const { domaineDeFormation, setDomaineDeFormation, isLoading, setIsLoading } = value;
  const { presence, voie } = useDomaineDeFormationSearchParams();

  const formations = domaineDeFormation.formations
    .filter((formation) => (presence === "dispensees" ? formation.nbEtab > 0 : true))
    .filter((formation) => (presence === "absentes" ? formation.nbEtab === 0 : true))
    .filter((formation) => (voie === "apprentissage" ? formation.apprentissage : true))
    .filter((formation) => (voie === "scolaire" ? formation.scolaire : true));

  const formationsByPresence = domaineDeFormation.formations
    .filter((formation) => (presence === "dispensees" ? formation.nbEtab > 0 : true))
    .filter((formation) => (presence === "absentes" ? formation.nbEtab === 0 : true));

  const formationsByVoie = domaineDeFormation.formations
    .filter((formation) => (voie === "apprentissage" ? formation.apprentissage : true))
    .filter((formation) => (voie === "scolaire" ? formation.scolaire : true));

  const counter: FormationsCounter = {
    inScope: formationsByVoie.filter((f) => f.nbEtab > 0).length,
    outsideScope: formationsByVoie.filter((f) => f.nbEtab === 0).length,
    scolaire: formationsByPresence.filter((f) => f.scolaire).length,
    apprentissage: formationsByPresence.filter((f) => f.apprentissage).length,
    allVoies: formationsByPresence.length,
    allScopes: domaineDeFormation.formations.length,
  };

  const formationsByLibelleNiveauDiplome: Record<string, FormationListItem[]> =
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
