import { Flex, Select, Text, VisuallyHidden } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import type { ScopeZone } from "shared";
import { ScopeEnum } from "shared";

import { TooltipDefinitionTauxDevenirFavorable } from "@/app/(wrapped)/components/definitions/DefinitionTauxDevenirFavorable";
import { TooltipDefinitionTauxEmploi6Mois } from "@/app/(wrapped)/components/definitions/DefinitionTauxEmploi6Mois";
import { TooltipDefinitionTauxPoursuiteEtudes } from "@/app/(wrapped)/components/definitions/DefinitionTauxPoursuiteEtudes";
import type { Formation, FormationIndicateurs, TauxIJType } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/types";
import { BadgeScope } from "@/components/BadgeScope";
import { GlossaireShortcut } from "@/components/GlossaireShortcut";

import { DevenirBarGraph } from "./DevenirBarGraph";
import { displayIJDatas } from "./displayIndicators";

const GlossaireIcon = ({ tauxIJSelected }: { tauxIJSelected: TauxIJType }) => {
  if (tauxIJSelected === "tauxInsertion") {
    return (
      <TooltipDefinitionTauxEmploi6Mois />
    );
  }
  if (tauxIJSelected === "tauxPoursuite") {
    return (
      <TooltipDefinitionTauxPoursuiteEtudes />
    );
  }
  if (tauxIJSelected === "tauxDevenirFavorable") {
    return (
      <GlossaireShortcut
        display={"inline"}
        marginInline={1}
        iconSize={"16px"}
        glossaireEntryKey={"taux-de-devenir-favorable"}
        tooltip={<TooltipDefinitionTauxDevenirFavorable />}
      />
    );
  }
  return null;
};

const tauxIJOptions = [
  {
    label: "Taux d'emploi à 6 mois",
    value: "tauxInsertion",
  },
  {
    label: "Taux de poursuite d'études",
    value: "tauxPoursuite",
  },
  {
    label: "Taux de devenir favorable",
    value: "tauxDevenirFavorable",
  },
];

export const TauxIJCard = ({
  scope,
  handleChangeTauxIJ,
  tauxIJSelected,
  formation,
  indicateurs,
}: {
  scope: ScopeZone;
  handleChangeTauxIJ: (e: ChangeEvent<HTMLSelectElement>) => void;
  tauxIJSelected: TauxIJType;
  formation: Formation;
  indicateurs: FormationIndicateurs;
}) => {
  return (
    <Flex
      direction={"column"}
      borderRadius={"4px"}
      border={"1px solid"}
      borderColor={"grey.925"}
      p={"12px"}
      bg={"white"}
      height={"250px"}
    >
      <Flex direction={"column"} gap={2}>
        <Flex justifyContent={"space-between"}>
          <VisuallyHidden as="label" htmlFor="select-taux-IJ">Sélectionner un indicateur inserjeunes</VisuallyHidden>
          <Select
            id="select-taux-IJ"
            width="64"
            size="sm"
            variant="newInput"
            bg={"grey.150"}
            onChange={handleChangeTauxIJ}
            value={tauxIJSelected}
          >
            {tauxIJOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label.toUpperCase()}
              </option>
            ))}
          </Select>
          <GlossaireIcon tauxIJSelected={tauxIJSelected} />
        </Flex>
        <BadgeScope scope={scope === ScopeEnum.national ? ScopeEnum.national : ScopeEnum.région} />
      </Flex>
      {displayIJDatas(indicateurs, tauxIJSelected) ? (
        <DevenirBarGraph
          datas={indicateurs.tauxIJ[tauxIJSelected]}
          hasVoieScolaire={formation.isScolaire}
          hasVoieApprentissage={formation.isApprentissage}
        />
      ) : (
        <Flex alignItems={"flex-end"} justifyContent={"flex-end"} height={"100%"}>
          <Text>Indisponible</Text>
        </Flex>
      )}
    </Flex>
  );
};
