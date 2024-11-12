import { Flex } from "@chakra-ui/react";

import { Breadcrumb } from "@/components/Breadcrumb";

import { FORMATION_COLUMNS } from "../FORMATION_COLUMNS";
import { Filters, FiltersList, Order, RequetesEnregistrees } from "../types";
import { FiltersSection } from "./FiltersSection";

export const HeaderSection = ({
  handleFilters,
  setSearchParams,
  searchParams,
  filtersList,
  requetesEnregistrees,
  requeteEnregistreeActuelle,
  setRequeteEnregistreeActuelle,
}: {
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
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
  requeteEnregistreeActuelle: { nom: string; couleur?: string };
  setRequeteEnregistreeActuelle: (requeteEnregistreeActuelle: {
    nom: string;
    couleur?: string;
  }) => void;
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
        handleFilters={handleFilters}
        setSearchParams={setSearchParams}
        searchParams={searchParams}
        filtersList={filtersList}
        requetesEnregistrees={requetesEnregistrees}
        requeteEnregistreeActuelle={requeteEnregistreeActuelle}
        setRequeteEnregistreeActuelle={setRequeteEnregistreeActuelle}
      />
    </Flex>
  );
};
