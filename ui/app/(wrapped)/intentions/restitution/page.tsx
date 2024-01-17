"use client";

import { Box, Container, Flex } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";
import { useContext, useEffect, useState } from "react";

import { client } from "@/api.client";
import { GuardPermission } from "@/utils/security/GuardPermission";

import { TableFooter } from "../../../../components/TableFooter";
import { createParametrizedUrl } from "../../../../utils/createParametrizedUrl";
import { downloadCsv } from "../../../../utils/downloadCsv";
import { CodeRegionFilterContext } from "../../../layoutClient";
import { ConsoleSection } from "./ConsoleSection/ConsoleSection";
import { HeaderSection } from "./HeaderSection/HeaderSection";
import { STATS_DEMANDES_COLUMNS } from "./STATS_DEMANDES_COLUMN";
import { Filters, Order } from "./types";

const PAGE_SIZE = 30;

const TableHeader = ({
  page,
  pageSize,
  count = 0,
}: {
  page: number;
  pageSize: number;
  count?: number;
}) => {
  return (
    <Flex align="center" py="1.5" justifyContent={"end"}>
      <Box mr="4">
        {page * pageSize} - {Math.min((page + 1) * pageSize, count)} sur {count}
      </Box>
    </Flex>
  );
};

export default () => {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<Filters>;
    order?: Partial<Order>;
    page?: string;
  } = qs.parse(queryParams.toString(), { arrayLimit: Infinity });

  const filters = searchParams.filters ?? {};
  const order = searchParams.order ?? { order: "asc" };
  const page = searchParams.page ? parseInt(searchParams.page) : 0;

  const setSearchParams = (params: {
    filters?: typeof filters;
    order?: typeof order;
    page?: typeof page;
  }) => {
    router.replace(
      createParametrizedUrl(location.pathname, { ...searchParams, ...params })
    );
  };

  const { codeRegionFilter, setCodeRegionFilter } = useContext(
    CodeRegionFilterContext
  );

  const [rentreeScolaireFilter, setRentreeScolaireFilter] =
    useState<string>("2024");

  const [statutFilter, setStatutFilter] = useState<
    ("draft" | "submitted" | "refused")[] | undefined
  >(["draft", "submitted"]);

  useEffect(() => {
    if (codeRegionFilter != "") {
      filters.codeRegion = [codeRegionFilter];
    }
    if (rentreeScolaireFilter != "") {
      filters.rentreeScolaire = rentreeScolaireFilter;
    }
    if (statutFilter != undefined) {
      filters.status = statutFilter;
    }
    setSearchParams({ filters: filters });
  }, []);

  const trackEvent = usePlausible();
  const filterTracker = (filterName: keyof Filters) => () => {
    trackEvent("restitution-demandes:filtre", {
      props: { filter_name: filterName },
    });
  };

  const handleOrder = (column: Order["orderBy"]) => {
    trackEvent("restitution-demandes:ordre", { props: { colonne: column } });
    if (order?.orderBy !== column) {
      setSearchParams({ order: { order: "desc", orderBy: column } });
      return;
    }
    setSearchParams({
      order: {
        order: order?.order === "asc" ? "desc" : "asc",
        orderBy: column,
      },
    });
  };

  const handleDefaultFilters = (
    type: keyof Filters,
    value: Filters[keyof Filters]
  ) => {
    if (type === "codeRegion" && value != null) {
      setCodeRegionFilter(value[0] ?? "");
    }
    if (type === "rentreeScolaire" && value != null)
      setRentreeScolaireFilter(value[0] ?? "");
    if (type === "status" && value != null)
      setStatutFilter([value[0] as "draft" | "submitted" | "refused"]);
  };

  const handleFilters = (
    type: keyof Filters,
    value: Filters[keyof Filters]
  ) => {
    handleDefaultFilters(type, value);
    setSearchParams({
      filters: { ...filters, [type]: value },
    });
  };

  const { data, isLoading: isLoading } = client
    .ref("[GET]/intentions/stats")
    .useQuery(
      {
        query: {
          ...filters,
          ...order,
          offset: page * PAGE_SIZE,
          limit: PAGE_SIZE,
        },
      },
      {
        keepPreviousData: true,
        staleTime: 10000000,
      }
    );

  const { data: countData, isLoading: isLoadingCount } = client
    .ref("[GET]/intentions/stats/count")
    .useQuery(
      {
        query: {
          ...filters,
        },
      },
      {
        keepPreviousData: true,
        staleTime: 10000000,
      }
    );

  return (
    <GuardPermission permission="restitution-intentions/lecture">
      <Container maxWidth={"100%"} py="4" pt={8} bg="blueecume.925">
        <HeaderSection
          countData={countData}
          activeFilters={filters}
          handleFilters={handleFilters}
          filterTracker={filterTracker}
          isLoading={isLoading || isLoadingCount}
          data={data}
        />
        <TableHeader page={page} pageSize={PAGE_SIZE} count={data?.count} />
        <ConsoleSection
          data={data}
          isLoading={isLoading}
          handleOrder={handleOrder}
          order={order}
        />
        <TableFooter
          mb={36}
          pl="4"
          onExport={async () => {
            trackEvent("restitution-demandes:export");
            const data = await client.ref("[GET]/intentions/stats").query({
              query: { ...filters, ...order, limit: 10000000 },
            });
            downloadCsv(
              "demandes_stats_export.csv",
              data.demandes.map((demande) => ({
                ...demande,
                pression: demande.pression ? demande.pression / 100 : undefined,
              })),
              STATS_DEMANDES_COLUMNS
            );
          }}
          page={page}
          pageSize={PAGE_SIZE}
          count={data?.count}
          onPageChange={(newPage) => setSearchParams({ page: newPage })}
        />
      </Container>
    </GuardPermission>
  );
};
