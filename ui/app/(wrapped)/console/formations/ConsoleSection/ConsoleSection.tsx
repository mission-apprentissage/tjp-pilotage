import { Table, TableContainer, Tbody, Tr } from "@chakra-ui/react";
import { Fragment, useRef, useState } from "react";

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

  return (
    <TableContainer overflowY="auto" flex={1} position="relative" ref={tableRef} pb={6} m={0}>
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
  );
};
