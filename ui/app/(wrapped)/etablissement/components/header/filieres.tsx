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

const NUMBER_OF_MAX_FILIERES_TO_DISPLAY = 6;

export type Filiere = {
  icon: string;
  name: string;
};

export const Filieres = ({ filieres = [] }: { filieres?: Filiere[] }) => {
  const [splited, setSplited] = useState<Filiere[]>([]);
  const [hidden, setHidden] = useState<Filiere[]>([]);

  useEffect(() => {
    if (filieres.length > NUMBER_OF_MAX_FILIERES_TO_DISPLAY) {
      setSplited(filieres.slice(0, NUMBER_OF_MAX_FILIERES_TO_DISPLAY - 1));
      setHidden(filieres.slice(NUMBER_OF_MAX_FILIERES_TO_DISPLAY - 1));
    } else {
      setSplited(filieres);
    }
  }, [filieres]);

  return (
    <GridItem colSpan={6} mt={"32px"}>
      <Text
        fontSize={{ base: "14px", md: "18px" }}
        pb={"16px"}
        fontWeight={"bold"}
      >
        FILIÈRES PROPROSÉES
      </Text>
      {(filieres || []).length === 0 && <Text>Information indisponible</Text>}
      {(filieres || []).length > 0 && (
        <SimpleGrid columns={2} spacing={"16px"} color={"grey.50"}>
          {splited?.map((filiere, index) => (
            <Flex key={filiere.name} direction={"row"}>
              <Icon
                as={Iconify}
                icon={filiere.icon}
                borderRadius={"full"}
                boxSize={"24px"}
                bgColor={"grey.975"}
                p={"2px"}
                mr={"8px"}
              />
              <Text key={index}>{filiere.name}</Text>
            </Flex>
          ))}
          {hidden && hidden.length > 0 && (
            <Flex direction={"row"}>
              <Tooltip
                label={
                  <Flex direction={"column"} gap={1}>
                    {hidden.map((filiere) => (
                      <Text key={filiere.name}>{filiere.name}</Text>
                    ))}
                  </Flex>
                }
              >
                <Text>et {hidden.length} autres (Voir tout)</Text>
              </Tooltip>
            </Flex>
          )}
        </SimpleGrid>
      )}
    </GridItem>
  );
};
