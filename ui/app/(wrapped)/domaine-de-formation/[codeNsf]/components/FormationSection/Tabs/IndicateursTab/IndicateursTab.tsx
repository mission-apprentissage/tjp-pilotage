import {
  BadgeTypeFamille,
  TypeFamilleKeys,
} from "@/components/BadgeTypeFamille";
import { Badge, Flex, Heading, HStack, Select } from "@chakra-ui/react";
import { useState } from "react";

type DataResult = {
  libelle: string;
  typeFamille: TypeFamilleKeys;
  isTransitionEcologique: boolean;
};

type TauxIJType = "tauxInsertion" | "tauxPoursuite" | "tauxDevenirFavorable";

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

export const IndicateursTab = () => {
  const data: DataResult = {
    libelle: "Formation spécialisée",
    typeFamille: "specialite",
    isTransitionEcologique: true,
  };

  const [tauxIJ, setTauxIJ] = useState<TauxIJType>("tauxInsertion");

  return (
    <Flex direction={"column"} gap={8} w={"100%"}>
      <Flex direction={"column"} gap={4}>
        <Heading as="h3" fontSize={"20px"} fontWeight={"bold"}>
          {data.libelle}
        </Heading>
        <HStack>
          <BadgeTypeFamille
            typeFamille={data.typeFamille}
            labelSize="long"
            size="md"
          />
          {data.isTransitionEcologique && (
            <Badge size="md" variant={"success"}>
              Transition écologique
            </Badge>
          )}
        </HStack>
      </Flex>
      <Flex direction={"column"} gap={4} w={"100%"}>
        <Heading as="h3" fontSize={"14px"} fontWeight={"bold"}>
          DEVENIR DES ÉLÈVES
        </Heading>
        <HStack
          borderRadius={"4px"}
          border={"1px solid"}
          borderColor={"grey.925"}
          p={"12px"}
          bg={"white"}
        >
          <Flex justifyContent="start">
            <Select
              width="64"
              size="sm"
              variant="newInput"
              bg={"grey.150"}
              onChange={(e) => setTauxIJ(e.target.value as TauxIJType)}
              value={tauxIJ}
            >
              {tauxIJOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label.toUpperCase()}
                </option>
              ))}
            </Select>
          </Flex>
          {/* <BarGraph
            graphData={graphData}
            isFiltered={isFiltered}
            libelleRegion={libelleRegion}
          /> */}
        </HStack>
      </Flex>
    </Flex>
  );
};
