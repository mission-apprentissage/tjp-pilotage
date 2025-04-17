import { Box, Center, Flex, Skeleton, Table, TableContainer, Tbody, Td, Text, Thead, Tr } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Fragment } from "react";

import { GROUPED_STATS_DEMANDES_COLUMNS } from "@/app/(wrapped)/demandes/restitution/GROUPED_STATS_DEMANDES_COLUMN";
import type { STATS_DEMANDES_COLUMNS } from "@/app/(wrapped)/demandes/restitution/STATS_DEMANDES_COLUMN";
import type {
  DemandesRestitution,
  OrderDemandesRestitution,
} from "@/app/(wrapped)/demandes/restitution/types";

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
  colonneFilters,
  displayPilotageColumns,
  currentRS,
}: {
  data?: DemandesRestitution;
  isLoading: boolean;
  order: OrderDemandesRestitution;
  handleOrder: (column: OrderDemandesRestitution["orderBy"]) => void;
  colonneFilters: (keyof typeof STATS_DEMANDES_COLUMNS)[];
  displayPilotageColumns: boolean;
  currentRS: string;
}) => {
  const router = useRouter();

  const getCellColor = (column: keyof typeof STATS_DEMANDES_COLUMNS) => {
    const groupLabel = Object.keys(GROUPED_STATS_DEMANDES_COLUMNS).find((groupLabel) => {
      return Object.keys(GROUPED_STATS_DEMANDES_COLUMNS[groupLabel].options).includes(column);
    });
    return GROUPED_STATS_DEMANDES_COLUMNS[groupLabel as string].cellColor;
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

  if (!data?.demandes || data.demandes.length === 0)
    return (
      <Center mt={12}>
        <Text fontSize={18}>Aucune demande à afficher.</Text>
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
                displayPilotageColumns={displayPilotageColumns}
                currentRS={currentRS}
              />
            </Tr>
          </Thead>
          <Tbody>
            <Fragment>
              {data?.demandes.map((demande: DemandesRestitution["demandes"][0]) => {
                return (
                  <Fragment key={`${demande.numero}`}>
                    <Tr
                      h="12"
                      cursor={"pointer"}
                      onClick={() =>
                        router.push(
                          `/demandes/synthese/${demande.numero}`
                        )
                      }
                      role="group"
                    >
                      <LineContent
                        demande={demande}
                        colonneFilters={colonneFilters}
                        getCellColor={getCellColor}
                        displayPilotageColumns={displayPilotageColumns}
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
