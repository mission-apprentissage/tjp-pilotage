import {
  Flex,
  GridItem,
  Icon,
  SimpleGrid,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { Icon as Iconify } from "@iconify/react";
import { useEffect, useState } from "react";

import { getNsfIcon } from "@/utils/getNsfIcon";

import { Nsfs } from "../types";

const NUMBER_OF_MAX_FILIERES_TO_DISPLAY = 6;

type NsfsWithIcon = Nsfs[0] & { icon: string };

export const Filieres = ({ nsfs = [] }: { nsfs?: Nsfs }) => {
  const [splited, setSplited] = useState<NsfsWithIcon[]>([]);
  const [hidden, setHidden] = useState<NsfsWithIcon[]>([]);

  useEffect(() => {
    if (nsfs.length > NUMBER_OF_MAX_FILIERES_TO_DISPLAY) {
      setSplited(
        nsfs
          .slice(0, NUMBER_OF_MAX_FILIERES_TO_DISPLAY - 1)
          .map((nsf) => ({ ...nsf, icon: getNsfIcon(nsf.codeNsf) }))
      );
      setHidden(
        nsfs
          .slice(NUMBER_OF_MAX_FILIERES_TO_DISPLAY - 1)
          .map((nsf) => ({ ...nsf, icon: getNsfIcon(nsf.codeNsf) }))
      );
    } else {
      setSplited(
        nsfs.map((nsf) => ({ ...nsf, icon: getNsfIcon(nsf.codeNsf) }))
      );
    }
  }, [nsfs]);

  return (
    <GridItem colSpan={5}>
      <Text fontSize={{ base: "14px" }} fontWeight={"bold"}>
        DOMAINES DE FORMATION PROPOSÉS
      </Text>
      {(nsfs || []).length === 0 && (
        <Text my={"16px"}>Information indisponible</Text>
      )}
      {(nsfs || []).length > 0 && (
        <SimpleGrid columns={2} spacing={"16px"} color={"grey.50"} my={"16px"}>
          {splited?.map((filiere) => (
            <Flex key={filiere.codeNsf} direction={"row"}>
              <Icon
                as={Iconify}
                icon={filiere.icon}
                borderRadius={"full"}
                boxSize={"24px"}
                bgColor={"grey.975"}
                p={"2px"}
                mr={"8px"}
              />
              <Text>{filiere.libelleNsf}</Text>
            </Flex>
          ))}
          {hidden && hidden.length > 0 && (
            <Flex direction={"row"}>
              <Tooltip
                label={
                  <Flex direction={"column"} gap={1}>
                    {hidden.map((filiere) => (
                      <Text key={filiere.libelleNsf}>{filiere.libelleNsf}</Text>
                    ))}
                  </Flex>
                }
              >
                <Text cursor={"pointer"} textDecoration={"underline"}>
                  et {hidden.length} autres (Voir tout)
                </Text>
              </Tooltip>
            </Flex>
          )}
        </SimpleGrid>
      )}
    </GridItem>
  );
};
