import { Flex, GridItem, Icon, SimpleGrid, Text, Tooltip } from "@chakra-ui/react";
import { Icon as Iconify } from "@iconify/react";
import { useEffect, useState } from "react";

import type { Nsfs } from "@/app/(wrapped)/panorama/etablissement/components/header/types";

const NUMBER_OF_MAX_FILIERES_TO_DISPLAY = 6;

type NsfsWithIcon = Nsfs[0] & { icon: string };

const getIcon = (codeNsf?: string): string => {
  if (!codeNsf) {
    return "solar:question-mark-linear";
  }

  const subCode = codeNsf.substring(0, 2);
  return (
    {
      ["10"]: "solar:square-academic-cap-linear",
      ["11"]: "solar:atom-linear",
      ["12"]: "solar:globus-linear",
      ["13"]: "solar:masks-linear",
      ["19"]: "solar:square-academic-cap-linear",
      ["20"]: "solar:shock-absorber-linear",
      ["21"]: "solar:leaf-linear",
      ["22"]: "solar:black-hole-2-linear",
      ["23"]: "solar:buildings-2-linear",
      ["24"]: "solar:t-shirt-linear",
      ["25"]: "solar:lightbulb-bolt-linear",
      ["29"]: "solar:settings-linear",
      ["30"]: "solar:users-group-two-rounded-linear",
      ["31"]: "solar:chart-linear",
      ["32"]: "solar:dialog-linear",
      ["33"]: "solar:user-heart-rounded-linear",
      ["34"]: "solar:shield-user-linear",
      ["39"]: "solar:paint-roller-linear",
      ["41"]: "solar:hiking-round-linear",
      ["42"]: "solar:balls-linear",
      ["49"]: "solar:sun-2-linear",
      ["99"]: "solar:folder-2-linear",
    }[subCode] ?? "solar:question-mark-linear"
  );
};

export const Filieres = ({ nsfs = [] }: { nsfs?: Nsfs }) => {
  const [splited, setSplited] = useState<NsfsWithIcon[]>([]);
  const [hidden, setHidden] = useState<NsfsWithIcon[]>([]);

  useEffect(() => {
    if (nsfs.length > NUMBER_OF_MAX_FILIERES_TO_DISPLAY) {
      setSplited(
        nsfs.slice(0, NUMBER_OF_MAX_FILIERES_TO_DISPLAY - 1).map((nsf) => ({ ...nsf, icon: getIcon(nsf.codeNsf) }))
      );
      setHidden(
        nsfs.slice(NUMBER_OF_MAX_FILIERES_TO_DISPLAY - 1).map((nsf) => ({ ...nsf, icon: getIcon(nsf.codeNsf) }))
      );
    } else {
      setSplited(nsfs.map((nsf) => ({ ...nsf, icon: getIcon(nsf.codeNsf) })));
    }
  }, [nsfs]);

  return (
    <GridItem colSpan={5}>
      <Text fontSize={{ base: "14px" }} fontWeight={"bold"}>
        DOMAINES DE FORMATION PROPOSÉS
      </Text>
      {(nsfs || []).length === 0 && <Text my={"16px"}>Information indisponible</Text>}
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
