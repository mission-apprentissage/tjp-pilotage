import { Table, TableContainer, Tbody, Tr } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useRef, useState } from "react";
import { CURRENT_RENTREE, RENTREES_SCOLAIRES } from "shared";

import { client } from "@/api.client";
import type { FORMATION_COLUMNS } from "@/app/(wrapped)/console/formations/FORMATION_COLUMNS";
import { GROUPED_FORMATION_COLUMNS } from "@/app/(wrapped)/console/formations/GROUPED_FORMATION_COLUMNS";
import type { Filters, FORMATION_COLUMNS_KEYS, Formations, LineId, Order } from "@/app/(wrapped)/console/formations/types";

import { HeadLineContent } from "./HeadLineContent";
import { FormationLineContent, FormationLineLoader, FormationLinePlaceholder } from "./LineContent";

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
  const [historiqueId, setHistoriqueId] = useState<LineId>();

  const { data: historique, isFetching: isFetchingHistorique } = useQuery({
    keepPreviousData: false,
    staleTime: 10000000,
    queryKey: ["formations", historiqueId, filters],
    enabled: !!historiqueId,
    queryFn: async () => {
      if (!historiqueId) return;
      return (
        await client.ref("[GET]/formations").query({
          query: {
            ...filters,
            cfd: [historiqueId?.cfd],
            codeDispositif: historiqueId?.codeDispositif ? [historiqueId?.codeDispositif] : undefined,
            limit: 2,
            order: "desc",
            orderBy: "rentreeScolaire",
            rentreeScolaire: RENTREES_SCOLAIRES.filter((rentree) => rentree !== CURRENT_RENTREE),
            withEmptyFormations: "false",
          },
        })
      ).formations;
    },
  });

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
                  expended={(
                    historiqueId?.cfd === formation.cfd
                    && historiqueId?.codeDispositif === formation.codeDispositif
                  )}
                  onClickExpend={() =>
                    setHistoriqueId({
                      cfd: formation.cfd,
                      codeDispositif: formation.codeDispositif,
                    })
                  }
                  onClickCollapse={() => setHistoriqueId(undefined)}
                  canShowQuadrantPosition={canShowQuadrantPosition}
                  colonneFilters={colonneFilters}
                  getCellBgColor={getCellBgColor}
                />
              </Tr>
              {historiqueId?.cfd === formation.cfd && historiqueId?.codeDispositif === formation.codeDispositif && (
                <>
                  {historique?.map((historiqueLine) => (
                    <Tr
                      key={`${historiqueLine.cfd}_${historiqueLine.codeDispositif}_${historiqueLine.rentreeScolaire}`}
                      bg={"grey.975"}
                    >
                      <FormationLineContent
                        stickyColonnes={stickyColonnes}
                        formation={historiqueLine}
                        canShowQuadrantPosition={canShowQuadrantPosition}
                        colonneFilters={colonneFilters}
                        filters={filters}
                        getCellBgColor={getCellBgColor}
                        isHistorique={true}
                      />
                    </Tr>
                  ))}
                  {historique && !historique.length && (
                    <FormationLinePlaceholder
                      colonneFilters={colonneFilters}
                      stickyColonnes={stickyColonnes}
                      getCellBgColor={getCellBgColor}
                    />
                  )}

                  {isFetchingHistorique && <FormationLineLoader />}
                </>
              )}
            </Fragment>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
