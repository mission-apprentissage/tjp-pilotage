import { Box, Center, Flex, Skeleton, Table, TableContainer, Tbody, Td, Text, Tr } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef,useState } from "react";

import { GROUPED_STATS_DEMANDES_COLUMNS } from "@/app/(wrapped)/demandes/restitution/GROUPED_STATS_DEMANDES_COLUMN";
import type { STATS_DEMANDES_COLUMNS } from "@/app/(wrapped)/demandes/restitution/STATS_DEMANDES_COLUMN";
import type { DEMANDES_COLUMNS_KEYS,DemandesRestitution, FiltersDemandesRestitution, OrderDemandesRestitution } from "@/app/(wrapped)/demandes/restitution/types";

import { HeadLineContent } from "./HeadLineContent";
import { LineContent } from "./LineContent";

const getCellColor = (column: DEMANDES_COLUMNS_KEYS) => {
  const groupLabel = Object.keys(GROUPED_STATS_DEMANDES_COLUMNS).find((groupLabel) => {
    return Object.keys(GROUPED_STATS_DEMANDES_COLUMNS[groupLabel].options).includes(column);
  });
  return GROUPED_STATS_DEMANDES_COLUMNS[groupLabel as string].cellColor;
};

const Loader = () => {
  return (
    <TableContainer overflowY={"auto"} flex={1} position="relative" bg={"white"}>
      <Table variant="simple" size={"sm"}>
        <Tbody>
          {new Array(7).fill(0).map((_, i) => {
            const key = `loader_RestitutionConsoleSection_${i}`;
            return (
              <Tr key={key} h="12">
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
            );}
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export const ConsoleSection = ({
  data,
  isLoading,
  order,
  activeFilters,
  handleOrder,
  colonneFilters,
  displayPilotageColumns,
  currentRS,
}: {
  data?: DemandesRestitution;
  isLoading: boolean;
  order: OrderDemandesRestitution;
  activeFilters: FiltersDemandesRestitution;
  handleOrder: (column: OrderDemandesRestitution["orderBy"]) => void;
  colonneFilters: (keyof typeof STATS_DEMANDES_COLUMNS)[];
  displayPilotageColumns: boolean;
  currentRS: string;
}) => {
  const router = useRouter();
  const topScrollRef = useRef<HTMLDivElement>(null);
  const bottomScrollRef = useRef<HTMLDivElement>(null);

  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const topScroll = topScrollRef.current;
    const bottomScroll = bottomScrollRef.current;

    if (!topScroll || !bottomScroll) return;

    // Récupère la largeur réelle du contenu scrollable
    const updateScrollWidth = () => {
      setScrollWidth(bottomScroll.scrollWidth);
    };

    updateScrollWidth();
    window.addEventListener('resize', updateScrollWidth);

    const syncTopToBottom = () => {
      if (bottomScroll) {
        bottomScroll.scrollLeft = topScroll.scrollLeft;
      }
    };

    const syncBottomToTop = () => {
      if (topScroll) {
        topScroll.scrollLeft = bottomScroll.scrollLeft;
      }
    };

    topScroll.addEventListener('scroll', syncTopToBottom);
    bottomScroll.addEventListener('scroll', syncBottomToTop);

    return () => {
      topScroll.removeEventListener('scroll', syncTopToBottom);
      bottomScroll.removeEventListener('scroll', syncBottomToTop);
      window.removeEventListener('resize', updateScrollWidth);
    };
  }, []);

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
    <Flex borderRadius={4}  bgColor={"transparent"}>
      <Box display="flex" flexDirection="column" height="100%" overflowY="hidden">
        <Box
          ref={topScrollRef}
          overflowX="auto"
          overflowY="hidden"
          p={1}
          height="15px"
          bgColor={"transparent"}
        >
          <Box height="1px" width={`${scrollWidth}px`} />
        </Box>
        <TableContainer overflowY="visible" flex={1} position="relative" borderRadius={5} ref={bottomScrollRef}>
          <Table variant="simple" size={"sm"} >
            <HeadLineContent
              order={order}
              handleOrder={handleOrder}
              activeFilters={activeFilters}
              colonneFilters={colonneFilters}
              getCellColor={getCellColor}
              displayPilotageColumns={displayPilotageColumns}
              currentRS={currentRS}
            />
            <Tbody>
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
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Flex>
  );
};
