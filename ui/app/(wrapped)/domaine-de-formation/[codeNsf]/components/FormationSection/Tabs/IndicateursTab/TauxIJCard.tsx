import { Box, Flex, Select, Text } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import type { ScopeZone } from "shared";
import { ScopeEnum } from "shared";

import type { Formation, FormationIndicateurs, TauxIJType } from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/types";
import { BadgeScope } from "@/components/BadgeScope";
import { GlossaireShortcut } from "@/components/GlossaireShortcut";

import { DevenirBarGraph } from "./DevenirBarGraph";
import { displayIJDatas } from "./displayIndicators";

const GlossaireIcon = ({ tauxIJSelected }: { tauxIJSelected: TauxIJType }) => {
  if (tauxIJSelected === "tauxInsertion") {
    return (
      <GlossaireShortcut
        display={"inline"}
        marginInline={1}
        iconSize={"16px"}
        glossaireEntryKey={"taux-emploi-6-mois"}
        tooltip={
          <Box>
            <Text>La part de ceux qui sont en emploi 6 mois après leur sortie d’étude.</Text>
            <Text>Cliquez pour plus d'infos.</Text>
          </Box>
        }
      />
    );
  }
  if (tauxIJSelected === "tauxPoursuite") {
    return (
      <GlossaireShortcut
        display={"inline"}
        marginInline={1}
        iconSize={"16px"}
        glossaireEntryKey={"taux-poursuite-etudes"}
        tooltip={
          <Box>
            <Text>Tout élève inscrit à N+1 (réorientation et redoublement compris).</Text>
            <Text>Cliquez pour plus d'infos.</Text>
          </Box>
        }
      />
    );
  }
  if (tauxIJSelected === "tauxDevenirFavorable") {
    return (
      <GlossaireShortcut
        display={"inline"}
        marginInline={1}
        iconSize={"16px"}
        glossaireEntryKey={"taux-de-devenir-favorable"}
        tooltip={
          <Box>
            <Text>
              (nombre d'élèves inscrits en formation + nombre d'élèves en emploi) / nombre d'élèves en entrée en
              dernière année de formation.
            </Text>
            <Text>Cliquez pour plus d'infos.</Text>
          </Box>
        }
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
          <Select
            width="64"
            size="sm"
            variant="newInput"
            bg={"grey.150"}
            onChange={handleChangeTauxIJ}
            // @ts-expect-error TODO
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
