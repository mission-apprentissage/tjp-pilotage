import { Flex } from "@chakra-ui/react";

import { Breadcrumb } from "@/components/Breadcrumb";

import { FORMATION_COLUMNS } from "../FORMATION_COLUMNS";
import { Filters, FiltersList, Order } from "../types";
import { FiltersSection } from "./FiltersSection";

export const HeaderSection = ({
  setSearchParams,
  searchParams,
  filtersList,
}: {
  setSearchParams: (params: {
    filters?: Partial<Filters>;
    search?: string;
    withAnneeCommune?: string;
    columns?: (keyof typeof FORMATION_COLUMNS)[];
    order?: Partial<Order>;
    page?: number;
  }) => void;
  searchParams: {
    filters?: Partial<Filters>;
    search?: string;
    withAnneeCommune?: string;
    columns?: (keyof typeof FORMATION_COLUMNS)[];
    order?: Partial<Order>;
    page?: string;
  };
  filtersList?: FiltersList;
}) => {
  return (
    <Flex
      direction={"column"}
      boxShadow={"0px 1px 4px 0px #00000026"}
      zIndex={1}
    >
      <Breadcrumb
        p={4}
        boxShadow={"0px 1px 4px 0px #00000026"}
        zIndex={1}
        pages={[
          { title: "Accueil", to: "/" },
          {
            title: "Console formations",
            to: "/console/formations",
            active: true,
          },
        ]}
      />
      <FiltersSection
        setSearchParams={setSearchParams}
        searchParams={searchParams}
        filtersList={filtersList}
      />
    </Flex>
  );
};
