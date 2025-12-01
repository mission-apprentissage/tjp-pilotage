import { Box, Table, TableContainer, Tbody, Tr } from "@chakra-ui/react";
import { Fragment, useEffect, useRef, useState } from "react";

import type { FORMATION_COLUMNS } from "@/app/(wrapped)/console/formations/FORMATION_COLUMNS";
import { GROUPED_FORMATION_COLUMNS } from "@/app/(wrapped)/console/formations/GROUPED_FORMATION_COLUMNS";
import type { Filters, FORMATION_COLUMNS_KEYS, Formations, Order } from "@/app/(wrapped)/console/formations/types";

import { HeadLineContent } from "./HeadLineContent";
import { FormationLineContent } from "./LineContent";

const getCellBgColor = (column: keyof typeof FORMATION_COLUMNS) => {
  const groupLabel = Object.keys(GROUPED_FORMATION_COLUMNS).find((groupLabel) => {
    return Object.keys(GROUPED_FORMATION_COLUMNS[groupLabel].options).includes(column);
  });
  return GROUPED_FORMATION_COLUMNS[groupLabel as string].cellColor;
};

export const ConsoleSection = ({
  data,
  filters,
  order,
  setSearchParams,
  canShowQuadrantPosition,
  colonneFilters,
}: {
  data?: Formations;
  filters: Partial<Filters>;
  order: Partial<Order>;
  setSearchParams: (params: {
    filters?: Partial<Filters>;
    search?: string;
    columns?: (keyof typeof FORMATION_COLUMNS)[];
    order?: Partial<Order>;
    page?: number;
  }) => void;
  canShowQuadrantPosition: boolean;
  colonneFilters: (keyof typeof FORMATION_COLUMNS)[];
}) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [stickyColonnes, setStickyColonnes] = useState<FORMATION_COLUMNS_KEYS[]>(["libelleFormation"]);

  const topScrollRef = useRef<HTMLDivElement>(null);

  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const topScroll = topScrollRef.current;
    const bottomScroll = tableRef.current;

    if (!topScroll || !bottomScroll) return;

    // Récupère la largeur réelle du contenu scrollable
    const updateScrollWidth = () => {
      setScrollWidth(bottomScroll.scrollWidth);
    };

    updateScrollWidth();
    window.addEventListener("resize", updateScrollWidth);

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

    topScroll.addEventListener("scroll", syncTopToBottom);
    bottomScroll.addEventListener("scroll", syncBottomToTop);

    return () => {
      topScroll.removeEventListener("scroll", syncTopToBottom);
      bottomScroll.removeEventListener("scroll", syncBottomToTop);
      window.removeEventListener("resize", updateScrollWidth);
    };
  }, [colonneFilters]);

  return (
    <Box display="flex" flexDirection="column" height="100%" overflowY="hidden">
      <Box
        ref={topScrollRef}
        overflowX="auto"
        overflowY="hidden"
        p={1}
        height="15px"
        bgColor={"white"}
        position={"sticky"}
        top={0}
        zIndex={2}
      >
        <Box height="1px" width={`${scrollWidth}px`} />
      </Box>
      <TableContainer flex={1} position="relative" ref={tableRef} pb={6} m={0}
        overflowX="auto"
        overflowY="visible"
        maxH="none">
        <Table variant="simple" size={"sm"}>
          <HeadLineContent
            stickyColonnes={stickyColonnes}
            setStickyColonnes={setStickyColonnes}
            order={order}
            setSearchParams={setSearchParams}
            canShowQuadrantPosition={canShowQuadrantPosition}
            colonneFilters={colonneFilters}
            getCellBgColor={getCellBgColor}
          />
          <Tbody>
            {data?.formations.map((formation) => (
              <Fragment key={`${formation.cfd}_${formation.codeDispositif}`}>
                <Tr h="12" bg={"white"} role="group">
                  <FormationLineContent
                    stickyColonnes={stickyColonnes}
                    formation={formation}
                    filters={filters}
                    canShowQuadrantPosition={canShowQuadrantPosition}
                    colonneFilters={colonneFilters}
                    getCellBgColor={getCellBgColor}
                  />
                </Tr>
              </Fragment>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
