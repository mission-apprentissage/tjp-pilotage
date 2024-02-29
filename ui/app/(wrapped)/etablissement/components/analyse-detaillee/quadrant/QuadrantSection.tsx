import { Badge, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

import { TooltipIcon } from "../../../../../../components/TooltipIcon";
import { ChiffresEntree, ChiffresIJ, Formation } from "../types";

export const QuadrantSection = ({
  _formations,
  _chiffresEntree,
  _chiffresIJ,
  _offre,
  _setOffre,
}: {
  _formations: Formation[];
  _chiffresEntree?: ChiffresEntree;
  _chiffresIJ?: ChiffresIJ;
  _offre?: string;
  _setOffre: (offre: string) => void;
}) => {
  return (
    <Flex direction={"column"} gap={4}>
      <Flex direction="row" justify={"space-between"}>
        <Text fontSize={14} fontWeight={700} textTransform={"uppercase"}>
          Quadrant
        </Text>
        <Badge variant="info" maxH={5} mt="auto">
          Millésimes 2021+2022
        </Badge>
      </Flex>
      <Text fontSize={14} color={"grey.200"}>
        Comparez les taux d'emploi et de poursuite d'études des formations de
        l'établissement avec les taux moyens de la région
      </Text>
      <Flex direction={"row"} gap={2} h={10}>
        <TooltipIcon label="Comprendre le quadrant"></TooltipIcon>
        <Text as={Link} href="test" color={"grey.425"}>
          Comprendre le quadrant
        </Text>
      </Flex>
    </Flex>
  );
};
