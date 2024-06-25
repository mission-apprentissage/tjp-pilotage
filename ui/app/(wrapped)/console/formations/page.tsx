"use client";

import {
  Center,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";
import { Fragment, useContext, useEffect, useState } from "react";
import { CURRENT_RENTREE, RENTREES_SCOLAIRES } from "shared";

import { client } from "@/api.client";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";

import { TableHeader } from "../../../../components/TableHeader";
import { CodeRegionFilterContext } from "../../../layoutClient";
import { ConsoleFilters } from "./components/ConsoleFilters";
import { HeadLineContent } from "./components/HeadLineContent";
import {
  FormationLineContent,
  FormationLineLoader,
  FormationLinePlaceholder,
} from "./components/LineContent";
import { FORMATION_COLUMNS } from "./FORMATION_COLUMNS";
import { Filters, LineId, Order } from "./types";

const PAGE_SIZE = 30;
const EXPORT_LIMIT = 1_000_000;

export default function Formations() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<Filters>;
    withAnneeCommune?: string;
    order?: Partial<Order>;
    page?: string;
  } = qs.parse(queryParams.toString(), { arrayLimit: Infinity });
  const trackEvent = usePlausible();

  const setSearchParams = (params: {
    filters?: typeof filters;
    withAnneeCommune?: typeof withAnneeCommune;
    order?: typeof order;
    page?: typeof page;
  }) => {
    router.replace(
      createParametrizedUrl(location.pathname, { ...searchParams, ...params })
    );
  };

  const filters = searchParams.filters ?? {};
  const withAnneeCommune = searchParams.withAnneeCommune ?? "true";
  const order = searchParams.order ?? { order: "asc" };
  const page = searchParams.page ? parseInt(searchParams.page) : 0;

  const { codeRegionFilter, setCodeRegionFilter } = useContext(
    CodeRegionFilterContext
  );

  useEffect(() => {
    if (codeRegionFilter !== "") {
      filters.codeRegion = [codeRegionFilter];
      setSearchParams({ filters: filters, withAnneeCommune });
    }
  }, []);

  const getFormationsQueryParameters = (qLimit: number, qOffset?: number) => ({
    ...filters,
    ...order,
    offset: qOffset,
    limit: qLimit,
    withAnneeCommune: withAnneeCommune?.toString() ?? "true",
  });

  const { data, isFetching } = client.ref("[GET]/formations").useQuery(
    {
      query: getFormationsQueryParameters(PAGE_SIZE, page * PAGE_SIZE),
    },
    { staleTime: 10000000, keepPreviousData: true }
  );

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
            withEmptyFormations: false,
          },
        })
      ).formations;
    },
  });

  const canShowQuadrantPosition = filters.codeRegion?.length === 1;

  return (
    <>
      <ConsoleFilters
        setSearchParams={setSearchParams}
        searchParams={searchParams}
        setCodeRegionFilter={setCodeRegionFilter}
        data={data}
      />
      <Flex direction="column" flex={1} position="relative" minH="0">
        {isFetching && (
          <Center
            height="100%"
            width="100%"
            position="absolute"
            bg="rgb(255,255,255,0.8)"
            zIndex="1"
          >
            <Spinner />
          </Center>
        )}
        <TableHeader
          onExportCsv={async () => {
            trackEvent("formations:export");
            const data = await client.ref("[GET]/formations").query({
              query: getFormationsQueryParameters(EXPORT_LIMIT),
            });
            downloadCsv(
              "formations_export",
              data.formations,
              canShowQuadrantPosition
                ? FORMATION_COLUMNS
                : _.omit(FORMATION_COLUMNS, "positionQuadrant")
            );
          }}
          onExportExcel={async () => {
            const data = await client.ref("[GET]/formations").query({
              query: getFormationsQueryParameters(EXPORT_LIMIT),
            });
            trackEvent("formations:export-excel");
            downloadExcel(
              "formations_export",
              data.formations,
              canShowQuadrantPosition
                ? FORMATION_COLUMNS
                : _.omit(FORMATION_COLUMNS, "positionQuadrant")
            );
          }}
          page={page}
          pageSize={PAGE_SIZE}
          count={data?.count}
          onPageChange={(newPage) => setSearchParams({ page: newPage })}
        />
        <TableContainer overflowY="auto" flex={1} position="relative">
          <Table variant="simple" size={"sm"}>
            <HeadLineContent
              order={order}
              setSearchParams={setSearchParams}
              canShowQuadrantPosition={canShowQuadrantPosition}
            />
            <Tbody>
              {data?.formations.map((line) => (
                <Fragment key={`${line.cfd}_${line.codeDispositif}`}>
                  <Tr h="12">
                    <FormationLineContent
                      defaultRentreeScolaire={CURRENT_RENTREE}
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
                    />
                  </Tr>
                  {historiqueId?.cfd === line.cfd &&
                    historiqueId.codeDispositif === line.codeDispositif && (
                      <>
                        {historique?.map((historiqueLine) => (
                          <Tr
                            key={`${historiqueLine.cfd}_${historiqueLine.codeDispositif}`}
                            bg={"grey.975"}
                          >
                            <FormationLineContent
                              line={historiqueLine}
                              canShowQuadrantPosition={canShowQuadrantPosition}
                            />
                          </Tr>
                        ))}
                        {historique && !historique.length && (
                          <FormationLinePlaceholder />
                        )}

                        {isFetchingHistorique && <FormationLineLoader />}
                      </>
                    )}
                </Fragment>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </>
  );
}
