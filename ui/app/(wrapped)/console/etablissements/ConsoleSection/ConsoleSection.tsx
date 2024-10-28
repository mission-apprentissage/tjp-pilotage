import { Table, TableContainer, Tbody, Tr } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useEffect, useRef, useState } from "react";
import { CURRENT_RENTREE, RENTREES_SCOLAIRES } from "shared";

import { client } from "@/api.client";
import type { FORMATION_ETABLISSEMENT_COLUMNS } from "@/app/(wrapped)/console/etablissements/FORMATION_ETABLISSEMENT_COLUMNS";
import { GROUPED_FORMATION_ETABLISSEMENT_COLUMNS } from "@/app/(wrapped)/console/etablissements/GROUPED_FORMATION_ETABLISSEMENT_COLUMNS";
import type { Etablissements, Filters, LineId, Order } from "@/app/(wrapped)/console/etablissements/types";

import { HeadLineContent } from "./HeadLineContent";
import { EtablissementLineContent, EtablissementLineLoader, EtablissementLinePlaceholder } from "./LineContent";

const getCellBgColor = (column: keyof typeof FORMATION_ETABLISSEMENT_COLUMNS) => {
  const groupLabel = Object.keys(GROUPED_FORMATION_ETABLISSEMENT_COLUMNS).find((groupLabel) => {
    return Object.keys(GROUPED_FORMATION_ETABLISSEMENT_COLUMNS[groupLabel].options).includes(column);
  });
  return GROUPED_FORMATION_ETABLISSEMENT_COLUMNS[groupLabel as string].cellColor;
};

export const ConsoleSection = ({
  data,
  filters,
  order,
  setSearchParams,
  colonneFilters,
}: {
  data?: Etablissements;
  filters: Partial<Filters>;
  order: Order;
  setSearchParams: (params: {
    filters?: Partial<Filters>;
    search?: string;
    withAnneeCommune?: string;
    columns?: (keyof typeof FORMATION_ETABLISSEMENT_COLUMNS)[];
    order?: Partial<Order>;
    page?: number;
  }) => void;
  colonneFilters: (keyof typeof FORMATION_ETABLISSEMENT_COLUMNS)[];
}) => {
  const [historiqueId, setHistoriqueId] = useState<LineId>();

  const { data: historiqueData, isFetching: isFetchingHistoriqueData } = useQuery({
    keepPreviousData: false,
    staleTime: 10000000,
    queryKey: ["formations", historiqueId, filters],
    enabled: !!historiqueId,
    queryFn: async () => {
      if (!historiqueId) return;
      return (
        await client.ref("[GET]/etablissements").query({
          query: {
            ...filters,
            cfd: [historiqueId?.cfd],
            codeDispositif: historiqueId?.codeDispositif ? [historiqueId?.codeDispositif] : undefined,
            uai: [historiqueId.uai],
            limit: 2,
            order: "desc",
            orderBy: "rentreeScolaire",
            rentreeScolaire: RENTREES_SCOLAIRES.filter((rentree) => rentree !== CURRENT_RENTREE),
          },
        })
      ).etablissements;
    },
  });

  const [isFirstColumnSticky, setIsFirstColumnSticky] = useState(false);
  const [isSecondColumnSticky, setIsSecondColumnSticky] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (tableRef.current) {
      const scrollLeft = tableRef.current.scrollLeft;
      if (scrollLeft > 90 && scrollLeft <= 470) {
        setIsFirstColumnSticky(true);
      } else {
        setIsFirstColumnSticky(false);
      }
      if (scrollLeft > 475) {
        setIsSecondColumnSticky(true);
      } else {
        setIsSecondColumnSticky(false);
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
    <TableContainer overflowY="auto" ref={tableRef}>
      <Table variant="simple" size={"sm"}>
        <HeadLineContent
          isFirstColumnSticky={isFirstColumnSticky}
          isSecondColumnSticky={isSecondColumnSticky}
          order={order}
          setSearchParams={setSearchParams}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
        />
        <Tbody>
          {data?.etablissements.map(
            // @ts-expect-error TODO
            (line) => (
              <Fragment key={`${line.uai}_${line.codeDispositif}_${line.cfd}`}>
                <Tr h="12" bg={"white"} role="group">
                  <EtablissementLineContent
                    isFirstColumnSticky={isFirstColumnSticky}
                    isSecondColumnSticky={isSecondColumnSticky}
                    line={line}
                    expended={
                      historiqueId?.cfd === line.cfd &&
                      // @ts-expect-error TODO
                      historiqueId.codeDispositif === line.codeDispositif &&
                      // @ts-expect-error TODO
                      historiqueId.uai === line.uai
                    }
                    onClickExpend={() =>
                      setHistoriqueId({
                        cfd: line.cfd,
                        codeDispositif: line.codeDispositif,
                        uai: line.uai,
                      })
                    }
                    onClickCollapse={() => setHistoriqueId(undefined)}
                    colonneFilters={colonneFilters}
                    getCellBgColor={getCellBgColor}
                  />
                </Tr>
                {historiqueId?.cfd === line.cfd &&
                  // @ts-expect-error TODO
                  historiqueId.codeDispositif === line.codeDispositif &&
                  // @ts-expect-error TODO
                  historiqueId.uai === line.uai && (
                    <>
                      {historiqueData?.map(
                        // @ts-expect-error TODO
                        (historiqueLine) => (
                          <Tr key={`${historiqueLine.cfd}_${historiqueLine.codeDispositif}`} bg={"grey.975"}>
                            <EtablissementLineContent
                              isFirstColumnSticky={isFirstColumnSticky}
                              isSecondColumnSticky={isSecondColumnSticky}
                              line={historiqueLine}
                              colonneFilters={colonneFilters}
                              getCellBgColor={getCellBgColor}
                            />
                          </Tr>
                        )
                      )}

                      {historiqueData && !historiqueData.length && (
                        <EtablissementLinePlaceholder colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} />
                      )}

                      {isFetchingHistoriqueData && <EtablissementLineLoader />}
                    </>
                  )}
              </Fragment>
            )
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
