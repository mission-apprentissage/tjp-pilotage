import { Box, Center, Flex, Skeleton, Table, TableContainer, Tbody, Td, Text, Thead, Tr } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import type { CampagneType } from "shared/schema/campagneSchema";

import type { CORRECTIONS_COLUMNS } from "@/app/(wrapped)/demandes/corrections/CORRECTIONS_COLUMN";
import { GROUPED_CORRECTIONS_COLUMNS } from "@/app/(wrapped)/demandes/corrections/GROUPED_CORRECTIONS_COLUMN";
import type { Corrections, OrderCorrections } from "@/app/(wrapped)/demandes/corrections/types";

import { HeadLineContent } from "./HeadLineContent";
import { LineContent } from "./LineContent";

const Loader = () => {
  return (
    <TableContainer overflowY={"auto"} flex={1} position="relative" bg={"white"}>
      <Table variant="simple" size={"sm"}>
        <Tbody>
          {new Array(7).fill(0).map((_, i) => (
            <Tr key={`loader_RestitutionConsoleSection_option_${i}`} h="12">
              <Td>
                <Skeleton opacity={0.3} height="16px" width={"100%"} />
              </Td>
              <Td isNumeric>
                <Skeleton opacity={0.3} height="16px" width={"100%"} />
              </Td>
              <Td isNumeric>
                <Skeleton opacity={0.3} height="16px" width={"100%"} />
              </Td>
              <Td isNumeric>
                <Skeleton opacity={0.3} height="16px" width={"100%"} />
              </Td>
              <Td isNumeric>
                <Skeleton opacity={0.3} height="16px" width={"100%"} />
              </Td>
              <Td isNumeric>
                <Skeleton opacity={0.3} height="16px" width={"100%"} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export const ConsoleSection = ({
  data,
  isLoading,
  order,
  handleOrder,
  campagne,
  colonneFilters,
}: {
  data?: Corrections;
  isLoading: boolean;
  order: OrderCorrections;
  handleOrder: (column: OrderCorrections["orderBy"]) => void;
  campagne: CampagneType;
  colonneFilters: (keyof typeof CORRECTIONS_COLUMNS)[];
}) => {
  const router = useRouter();
  const getCellColor = (column: keyof typeof CORRECTIONS_COLUMNS) => {
    const groupLabel = Object.keys(GROUPED_CORRECTIONS_COLUMNS).find((groupLabel) => {
      return Object.keys(GROUPED_CORRECTIONS_COLUMNS[groupLabel].options).includes(column);
    });
    return GROUPED_CORRECTIONS_COLUMNS[groupLabel as string].cellColor;
  };

  if (isLoading) return <Loader />;
  if (colonneFilters.length === 0)
    return (
      <Center>
        <Box>
          <Text>Il n'y a pas de colonnes à afficher.</Text>
          <Text>Veuillez en sélectionner dans le menu déroulant pour afficher des données.</Text>
        </Box>
      </Center>
    );

  if (!data?.corrections || data.corrections.length === 0)
    return (
      <Center mt={12}>
        <Text fontSize={18}>Aucune correction à afficher.</Text>
      </Center>
    );

  return (
    <Flex borderRadius={4} border={"1px solid"} borderColor="grey.900" wrap={"wrap"} bg={"white"}>
      <TableContainer overflowY="auto" flex={1} position="relative" borderRadius={5}>
        <Table variant="simple" size={"sm"}>
          <Thead position="sticky" top="0" borderBottom={"2px solid #E2E8F0"}>
            <Tr>
              <HeadLineContent
                order={order}
                handleOrder={handleOrder}
                colonneFilters={colonneFilters}
                getCellColor={getCellColor}
              />
            </Tr>
          </Thead>
          <Tbody>
            <Fragment>
              {data?.corrections.map((correction: Corrections["corrections"][0]) => {
                return (
                  <Fragment key={`${correction.demandeNumero}`}>
                    <Tr
                      h="12"
                      role="group"
                      cursor={"pointer"}
                      onClick={() => router.push(`/demandes/saisie/${correction.demandeNumero}?correction=true`)}
                    >
                      <LineContent
                        correction={correction}
                        campagne={campagne}
                        colonneFilters={colonneFilters}
                        getCellColor={getCellColor}
                      />
                    </Tr>
                  </Fragment>
                );
              })}
            </Fragment>
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};
