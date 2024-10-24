import { Flex, Select } from "@chakra-ui/react";

import { FormationTab, Presence, Voie } from "../../types";
import { FormationTabs } from "./FormationTabs";

export const TabFilters = ({
  presenceValue,
  onChangePresence,
  voieValue,
  onChangeVoie,
  selectedTab,
  changeTab,
}: {
  presenceValue: Presence;
  onChangePresence: (value: Presence) => void;
  voieValue: Voie;
  onChangeVoie: (value: Voie) => void;
  selectedTab: FormationTab;
  changeTab: (tab: FormationTab) => void;
}) => {
  return (
    <Flex
      w={"100%"}
      p={"16px"}
      bgColor={"bluefrance.975"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Flex gap={"16px"}>
        <Select
          placeholder="Présence sur le territoire: Tout"
          onChange={(e) => onChangePresence(e.target.value as Presence)}
          bgColor={"white"}
          value={presenceValue}
          autoFocus={true}
          borderWidth={"2px"}
          borderColor={"bluefrance.113"}
          borderStyle={"solid"}
          aria-label="Sélectionner une présence à afficher"
        >
          <option value="">Tout</option>
          <option value="dispensees">
            Uniquement celles dispensées sur le territoire
          </option>
          <option value="absentes">
            Uniquement celles absentes sur ce territoire
          </option>
        </Select>

        <Select
          placeholder="Voie: Tout"
          onChange={(e) => onChangeVoie(e.target.value as Voie)}
          bgColor={"white"}
          value={voieValue}
          autoFocus={true}
          borderWidth={"2px"}
          borderColor={"bluefrance.113"}
          borderStyle={"solid"}
          aria-label="Sélectionner une voie"
        >
          <option value="">Tout</option>
          <option value="scolaire">Scolaire seul</option>
          <option value="apprentissage">Apprentissage seul</option>
        </Select>
      </Flex>
      <FormationTabs selectedTab={selectedTab} changeTab={changeTab} />
    </Flex>
  );
};
