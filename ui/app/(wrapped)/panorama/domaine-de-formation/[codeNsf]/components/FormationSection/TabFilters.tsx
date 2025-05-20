import { Flex, Select } from "@chakra-ui/react";

import { useDomaineDeFormation } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/context/domaineDeFormationContext";
import { useFormationContext } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/context/formationContext";
import type { Presence, Voie } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/types";

import { FormationTabs } from "./FormationTabs";

export const TabFilters = () => {
  const { counter } = useDomaineDeFormation();
  const { handlePresenceChange, handleVoieChange, currentFilters, handleTabFormationChange } = useFormationContext();

  return (
    <Flex w={"100%"} p={"16px"} bgColor={"bluefrance.975"} alignItems={"center"} justifyContent={"space-between"} position="sticky"
      // 52px = navbar height
      // 119px = page filters height
      top="calc(119px + 52px)"
      left="0"
      z-index="10"
    >
      <Flex gap={"16px"}>
        <Select
          onChange={(e) => handlePresenceChange(e.target.value as Presence)}
          bgColor={"white"}
          value={currentFilters.presence}
          autoFocus={true}
          borderWidth={"1px"}
          borderColor={"grey.900"}
          borderStyle={"solid"}
          aria-label="Sélectionner une présence à afficher"
        >
          <option value="">Présence sur le territoire: Tout ({counter.allScopes})</option>
          <option value="dispensees">Uniquement celles dispensées sur le territoire ({counter.inScope})</option>
          <option value="absentes">Uniquement celles absentes sur ce territoire ({counter.outsideScope})</option>
        </Select>
        <Select
          onChange={(e) => handleVoieChange(e.target.value as Voie)}
          bgColor={"white"}
          value={currentFilters.voie}
          autoFocus={true}
          borderWidth={"1px"}
          borderColor={"grey.900"}
          borderStyle={"solid"}
          aria-label="Sélectionner une voie"
        >
          <option value="">Voie: Scolaire + Apprentissage ({counter.allVoies})</option>
          <option value="scolaire">Scolaire ({counter.scolaire})</option>
          <option value="apprentissage">Apprentissage ({counter.apprentissage})</option>
        </Select>
      </Flex>
      <FormationTabs selectedTab={currentFilters.formationTab} changeTab={handleTabFormationChange} />
    </Flex>
  );
};
