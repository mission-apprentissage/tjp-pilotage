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
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { CURRENT_RENTREE, RENTREES_SCOLAIRES } from "shared";

import { client } from "@/api.client";
import { FORMATION_ETABLISSEMENT_COLUMNS } from "@/app/(wrapped)/console/etablissements/FORMATION_ETABLISSEMENT_COLUMNS";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";

import { TableHeader } from "../../../../components/TableHeader";
import { formatExportFilename } from "../../../../utils/formatExportFilename";
import {
  CodeRegionFilterContext,
  UaiFilterContext,
} from "../../../layoutClient";
import { ConsoleFilters } from "./components/ConsoleFilters";
import { HeadLineContent } from "./components/HeadLineContent";
import {
  EtablissementLineContent,
  EtablissementLineLoader,
  EtablissementLinePlaceholder,
} from "./components/LineContent";
import { Filters, LineId, Order } from "./types";

const PAGE_SIZE = 30;
const EXPORT_LIMIT = 1_000_000;

type QueryResult = (typeof client.infer)["[GET]/etablissements"];

export default function Etablissements() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<Filters>;
    withAnneeCommune?: string;
    order?: Partial<Order>;
    page?: string;
  } = qs.parse(queryParams.toString(), { arrayLimit: Infinity });
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

  const { uaiFilter, setUaiFilter } = useContext(UaiFilterContext);

  useEffect(() => {
    if (codeRegionFilter !== "") {
      filters.codeRegion = [codeRegionFilter];
      setSearchParams({ filters: filters, withAnneeCommune });
    }
    if (uaiFilter !== "") {
      filters.uai = [uaiFilter];
      setSearchParams({ filters: filters, withAnneeCommune });
    }
  }, []);

  const getEtablissementsQueryParameters = (
    qLimit: number,
    qOffset?: number
  ) => ({
    ...order,
    ...filters,
    offset: qOffset,
    limit: qLimit,
    withAnneeCommune: withAnneeCommune?.toString() ?? "true",
  });

  const { data, isFetching } = client.ref("[GET]/etablissements").useQuery(
    {
      query: getEtablissementsQueryParameters(PAGE_SIZE, page * PAGE_SIZE),
    },
    {
      staleTime: 10000000,
    }
  );

  const trackEvent = usePlausible();

  const getDataForExport = (data: QueryResult) => {
    const region = data.filters.regions.find(
      (r) => r.value === filters.codeRegion?.[0]
    );

    if (filters.codeRegion && region) {
      const columns = {
        ...FORMATION_ETABLISSEMENT_COLUMNS,
        selectedCodeRegion: "Code Région sélectionné",
        selectedRegion: "Région sélectionnée",
      };

      let etablissements = data.etablissements;

      etablissements = data.etablissements.map((f) => ({
        ...f,
        selectedCodeRegion: region.value,
        selectedRegion: region.label,
      }));

      return {
        columns,
        etablissements,
      };
    }

    return {
      columns: { ...FORMATION_ETABLISSEMENT_COLUMNS },
      etablissements: data.etablissements,
    };
  };

  const onExportCsv = async () => {
    trackEvent("formations:export");
    const data = await client.ref("[GET]/etablissements").query({
      query: getEtablissementsQueryParameters(EXPORT_LIMIT),
    });

    const { columns, etablissements } = getDataForExport(data);

    downloadCsv(
      formatExportFilename("etablissement_export", filters?.codeRegion),
      etablissements,
      columns
    );
  };

  const onExportExcel = async () => {
    const data = await client.ref("[GET]/etablissements").query({
      query: getEtablissementsQueryParameters(EXPORT_LIMIT),
    });
    trackEvent("etablissements:export-excel");

    const { columns, etablissements } = getDataForExport(data);

    downloadExcel(
      formatExportFilename("etablissement_export", filters?.codeRegion),
      etablissements,
      columns
    );
  };

  const [historiqueId, setHistoriqueId] = useState<LineId>();

  const { data: historique, isFetching: isFetchingHistorique } = useQuery({
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
            codeDispositif: historiqueId?.codeDispositif
              ? [historiqueId?.codeDispositif]
              : undefined,
            uai: [historiqueId.uai],
            limit: 2,
            order: "desc",
            orderBy: "rentreeScolaire",
            rentreeScolaire: RENTREES_SCOLAIRES.filter(
              (rentree) => rentree !== CURRENT_RENTREE
            ),
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
      console.log(scrollLeft);
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
    <>
      <ConsoleFilters
        setUaiFilter={setUaiFilter}
        setCodeRegionFilter={setCodeRegionFilter}
        setSearchParams={setSearchParams}
        searchParams={searchParams}
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
          onExportCsv={() => onExportCsv()}
          onExportExcel={() => onExportExcel()}
          page={page}
          pageSize={PAGE_SIZE}
          count={data?.count}
          onPageChange={(newPage) => setSearchParams({ page: newPage })}
        />
        <TableContainer overflowY="auto" ref={tableRef}>
          <Table variant="simple" size={"sm"}>
            <HeadLineContent
              isFirstColumnSticky={isFirstColumnSticky}
              isSecondColumnSticky={isSecondColumnSticky}
              order={order}
              setSearchParams={setSearchParams}
            />
            <Tbody>
              {data?.etablissements.map((line) => (
                <Fragment
                  key={`${line.uai}_${line.codeDispositif}_${line.cfd}`}
                >
                  <Tr h="12">
                    <EtablissementLineContent
                      isFirstColumnSticky={isFirstColumnSticky}
                      isSecondColumnSticky={isSecondColumnSticky}
                      line={line}
                      defaultRentreeScolaire={CURRENT_RENTREE}
                      expended={
                        historiqueId?.cfd === line.cfd &&
                        historiqueId.codeDispositif === line.codeDispositif &&
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
                    />
                  </Tr>
                  {historiqueId?.cfd === line.cfd &&
                    historiqueId.codeDispositif === line.codeDispositif &&
                    historiqueId.uai === line.uai && (
                      <>
                        {historique?.map((historiqueLine) => (
                          <Tr
                            key={`${historiqueLine.cfd}_${historiqueLine.codeDispositif}`}
                            bg={"grey.975"}
                          >
                            <EtablissementLineContent
                              isFirstColumnSticky={isFirstColumnSticky}
                              isSecondColumnSticky={isSecondColumnSticky}
                              line={historiqueLine}
                            />
                          </Tr>
                        ))}

                        {historique && !historique.length && (
                          <EtablissementLinePlaceholder />
                        )}

                        {isFetchingHistorique && <EtablissementLineLoader />}
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
