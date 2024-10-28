import { Flex } from "@chakra-ui/react";

import { Breadcrumb } from "@/components/Breadcrumb";

import { FORMATION_ETABLISSEMENT_COLUMNS } from "../FORMATION_ETABLISSEMENT_COLUMNS";
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
    withAnneeCommune?: string;
    columns?: (keyof typeof FORMATION_ETABLISSEMENT_COLUMNS)[];
    order?: Partial<Order>;
    page?: number;
  }) => void;
  searchParams: {
    filters?: Partial<Filters>;
    search?: string;
    withAnneeCommune?: string;
    columns?: (keyof typeof FORMATION_ETABLISSEMENT_COLUMNS)[];
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
    >
      <Breadcrumb
        p={4}
        boxShadow={"0px 1px 4px 0px #00000026"}
        zIndex={1}
        pages={[
          { title: "Accueil", to: "/" },
          {
            title: "Console établissements",
            to: "/console/etablissements",
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
