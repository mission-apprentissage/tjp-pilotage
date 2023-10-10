"use client";

import { Container } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";

import { GuardPermission } from "@/utils/security/GuardPermission";

import { api } from "../../../api.client";
import { TableFooter } from "../../../components/TableFooter";
import { createParametrizedUrl } from "../../../utils/createParametrizedUrl";
import { ConsoleSection } from "./components/ConsoleSection";
import { HeaderSection } from "./components/HeaderSection";
import { Filters, Order } from "./types";

const PAGE_SIZE = 30;

export default () => {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<Filters>;
    order?: Partial<Order>;
    page?: string;
  } = qs.parse(queryParams.toString());

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
      ...filters,
      order: {
        order: order?.order === "asc" ? "desc" : "asc",
        orderBy: column,
      },
    });
  };

  const handleFilters = (
    type: keyof Filters,
    value: Filters[keyof Filters]
  ) => {
    setSearchParams({
      filters: { ...filters, [type]: value },
    });
  };

  const { data, isLoading: isLoading } = useQuery({
    keepPreviousData: true,
    staleTime: 10000000,
    queryKey: ["statsDemandes", filters, order, page],
    queryFn: api.getStatsDemandes({
      query: {
        ...filters,
        ...order,
        offset: page * PAGE_SIZE,
        limit: PAGE_SIZE,
      },
    }).call,
  });

  const { data: countData, isLoading: isLoadingCount } = useQuery({
    keepPreviousData: true,
    staleTime: 10000000,
    queryKey: ["countStatsDemandes", filters],
    queryFn: async () =>
      api
        .countStatsDemandes({
          query: {
            ...filters,
          },
        })
        .call(),
  });

  return (
    <GuardPermission permission="intentions/lecture">
      <Container maxWidth={"100%"} py="4" pt={8} bg="#E2E7F8">
        <HeaderSection
          countData={countData}
          activeFilters={filters}
          handleFilters={handleFilters}
          filterTracker={filterTracker}
          isLoading={isLoading || isLoadingCount}
          data={data}
        />
        <ConsoleSection
          data={data}
          isLoading={isLoading}
          handleOrder={handleOrder}
          order={order}
        />
        <TableFooter
          mb={36}
          pl="4"
          onExport={() => trackEvent("restituition-demandes:export")}
          downloadLink={
            api.getStatsDemandesCsv({
              query: { ...filters, ...order },
            }).url
          }
          page={page}
          pageSize={PAGE_SIZE}
          count={data?.count}
          onPageChange={(newPage) => setSearchParams({ page: newPage })}
        />
      </Container>
    </GuardPermission>
  );
};
