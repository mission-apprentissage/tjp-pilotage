import { Flex } from "@chakra-ui/react";

import { Breadcrumb } from "@/components/Breadcrumb";

import { FORMATION_COLUMNS } from "../FORMATION_COLUMNS";
import { Filters, FiltersList, Order, RequetesEnregistrees } from "../types";
import { FiltersSection } from "./FiltersSection";

export const HeaderSection = ({
  setSearchParams,
  searchParams,
  filtersList,
  requetesEnregistrees,
}: {
  setSearchParams: (params: {
    filters?: Partial<Filters>;
    search?: string;
    columns?: (keyof typeof FORMATION_COLUMNS)[];
    order?: Partial<Order>;
    page?: number;
  }) => void;
  searchParams: {
    filters?: Partial<Filters>;
    search?: string;
    columns?: (keyof typeof FORMATION_COLUMNS)[];
    order?: Partial<Order>;
    page?: string;
  };
  filtersList?: FiltersList;
  requetesEnregistrees?: RequetesEnregistrees;
}) => {
  return (
    <Flex
      direction={"column"}
      boxShadow={"0px 1px 4px 0px #00000026"}
      zIndex={1}
      p={4}
      gap={6}
    >
      <Breadcrumb
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
        requetesEnregistrees={requetesEnregistrees}
      />
    </Flex>
  );
};
