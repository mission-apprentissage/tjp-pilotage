import { Table, TableContainer, Tbody, Tr } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useEffect, useRef, useState } from "react";
import { CURRENT_RENTREE, RENTREES_SCOLAIRES } from "shared";

import { client } from "@/api.client";

import { FORMATION_COLUMNS } from "../FORMATION_COLUMNS";
import { GROUPED_FORMATION_COLUMNS } from "../GROUPED_FORMATION_COLUMNS";
import { Filters, Formations, LineId, Order } from "../types";
import { HeadLineContent } from "./HeadLineContent";
import {
  FormationLineContent,
  FormationLineLoader,
  FormationLinePlaceholder,
} from "./LineContent";

const getCellBgColor = (column: keyof typeof FORMATION_COLUMNS) => {
  const groupLabel = Object.keys(GROUPED_FORMATION_COLUMNS).find(
    (groupLabel) => {
      return Object.keys(
        GROUPED_FORMATION_COLUMNS[groupLabel].options
      ).includes(column);
    }
  );
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
  order: Order;
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
            codeDispositif: historiqueId?.codeDispositif
              ? [historiqueId?.codeDispositif]
              : undefined,
            limit: 2,
            order: "desc",
            orderBy: "rentreeScolaire",
            rentreeScolaire: RENTREES_SCOLAIRES.filter(
              (rentree) => rentree !== CURRENT_RENTREE
            ),
            withEmptyFormations: "false",
          },
        })
      ).formations;
    },
  });

  const [isSticky, setIsSticky] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (tableRef.current) {
      const scrollLeft = tableRef.current.scrollLeft;
      if (scrollLeft > 200) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    }
  };

  useEffect(() => {
    const box = tableRef.current;
    if (box) {
      box.addEventListener("scroll", handleScroll);
      return () => {
        box.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  return (
    <TableContainer
      overflowY="auto"
      flex={1}
      position="relative"
      ref={tableRef}
    >
      <Table variant="simple" size={"sm"}>
        <HeadLineContent
          isSticky={isSticky}
          order={order}
          setSearchParams={setSearchParams}
          canShowQuadrantPosition={canShowQuadrantPosition}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
        />
        <Tbody>
          {data?.formations.map((line) => (
            <Fragment key={`${line.cfd}_${line.codeDispositif}`}>
              <Tr h="12" bg={"white"} role="group">
                <FormationLineContent
                  isSticky={isSticky}
                  line={line}
                  expended={
                    historiqueId?.cfd === line.cfd &&
                    historiqueId.codeDispositif === line.codeDispositif
                  }
                  onClickExpend={() =>
                    setHistoriqueId({
                      cfd: line.cfd,
                      codeDispositif: line.codeDispositif,
                    })
                  }
                  onClickCollapse={() => setHistoriqueId(undefined)}
                  canShowQuadrantPosition={canShowQuadrantPosition}
                  colonneFilters={colonneFilters}
                  getCellBgColor={getCellBgColor}
                />
              </Tr>
              {historiqueId?.cfd === line.cfd &&
                historiqueId.codeDispositif === line.codeDispositif && (
                  <>
                    {historique?.map((historiqueLine) => (
                      <Tr
                        key={`${historiqueLine.cfd}_${historiqueLine.codeDispositif}_${historiqueLine.rentreeScolaire}`}
                        bg={"grey.975"}
                      >
                        <FormationLineContent
                          isSticky={isSticky}
                          line={historiqueLine}
                          canShowQuadrantPosition={canShowQuadrantPosition}
                          colonneFilters={colonneFilters}
                          getCellBgColor={getCellBgColor}
                        />
                      </Tr>
                    ))}
                    {historique && !historique.length && (
                      <FormationLinePlaceholder
                        colonneFilters={colonneFilters}
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
