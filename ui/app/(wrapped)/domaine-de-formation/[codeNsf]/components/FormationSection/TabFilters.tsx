import { Flex, Select } from "@chakra-ui/react";

import type {
  FiltersNumberOfFormations,
  FormationTab,
  Presence,
  Voie,
} from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/types";

import { FormationTabs } from "./FormationTabs";

export const TabFilters = ({
  presenceValue,
  onChangePresence,
  voieValue,
  onChangeVoie,
  selectedTab,
  changeTab,
  filtersNumberOfFormations: {
    formationsAllScopes,
    formationsInScope,
    formationsOutsideScope,
    formationsAllVoies,
    formationsScolaire,
    formationsApprentissage,
  },
}: {
  presenceValue: Presence;
  onChangePresence: (value: Presence) => void;
  voieValue: Voie;
  onChangeVoie: (value: Voie) => void;
  selectedTab: FormationTab;
  changeTab: (tab: FormationTab) => void;
  filtersNumberOfFormations: FiltersNumberOfFormations;
}) => {
  return (
    <Flex w={"100%"} p={"16px"} bgColor={"bluefrance.975"} alignItems={"center"} justifyContent={"space-between"}>
      <Flex gap={"16px"}>
        <Select
          onChange={(e) => onChangePresence(e.target.value as Presence)}
          bgColor={"white"}
          value={presenceValue}
          autoFocus={true}
          borderWidth={"1px"}
          borderColor={"grey.900"}
          borderStyle={"solid"}
          aria-label="Sélectionner une présence à afficher"
        >
          <option value="">Présence sur le territoire: Tout ({formationsAllScopes})</option>
          <option value="dispensees">Uniquement celles dispensées sur le territoire ({formationsInScope})</option>
          <option value="absentes">Uniquement celles absentes sur ce territoire ({formationsOutsideScope})</option>
        </Select>

        <Select
          onChange={(e) => onChangeVoie(e.target.value as Voie)}
          bgColor={"white"}
          value={voieValue}
          autoFocus={true}
          borderWidth={"1px"}
          borderColor={"grey.900"}
          borderStyle={"solid"}
          aria-label="Sélectionner une voie"
        >
          <option value="">Voie: Tout ({formationsAllVoies})</option>
          <option value="scolaire">Scolaire ({formationsScolaire})</option>
          <option value="apprentissage">Apprentissage ({formationsApprentissage})</option>
        </Select>
      </Flex>
      <FormationTabs selectedTab={selectedTab} changeTab={changeTab} />
    </Flex>
  );
};
