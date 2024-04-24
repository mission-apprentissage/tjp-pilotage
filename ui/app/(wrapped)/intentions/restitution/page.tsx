"use client";

import { Container } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";
import { useContext, useEffect, useState } from "react";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import { client } from "@/api.client";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";
import { GuardPermission } from "@/utils/security/GuardPermission";

import { TableHeader } from "../../../../components/TableHeader";
import { CodeRegionFilterContext } from "../../../layoutClient";
import { ConsoleSection } from "./ConsoleSection/ConsoleSection";
import { HeaderSection } from "./HeaderSection/HeaderSection";
import { STATS_DEMANDES_COLUMNS } from "./STATS_DEMANDES_COLUMN";
import {
  FiltersDemandesRestitutionIntentions,
  OrderDemandesRestitutionIntentions,
} from "./types";

const PAGE_SIZE = 30;
const EXPORT_LIMIT = 1_000_000;

export default () => {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<FiltersDemandesRestitutionIntentions>;
    order?: Partial<OrderDemandesRestitutionIntentions>;
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

  const trackEvent = usePlausible();
  const filterTracker =
    (filterName: keyof FiltersDemandesRestitutionIntentions) => () => {
      trackEvent("restitution-demandes:filtre", {
        props: { filter_name: filterName },
      });
    };

  const handleOrder = (
    column: OrderDemandesRestitutionIntentions["orderBy"]
  ) => {
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
    type: keyof FiltersDemandesRestitutionIntentions,
    value: FiltersDemandesRestitutionIntentions[keyof FiltersDemandesRestitutionIntentions]
  ) => {
    if (value != null)
      switch (type) {
        case "codeRegion":
          setCodeRegionFilter((value as string[])[0] ?? "");
          break;
        case "rentreeScolaire":
          setRentreeScolaireFilter((value as string[])[0] ?? "");
          break;
        case "campagne":
          setCampagneFilter((value as string[])[0] ?? "");
          break;
        case "statut":
          setStatutFilter(value as ("draft" | "submitted" | "refused")[]);
          break;
      }
  };

  const handleFilters = (
    type: keyof FiltersDemandesRestitutionIntentions,
    value: FiltersDemandesRestitutionIntentions[keyof FiltersDemandesRestitutionIntentions]
  ) => {
    handleDefaultFilters(type, value);
    setSearchParams({
      filters: { ...filters, [type]: value },
    });
  };

  const getIntentionsStatsQueryParameters = (
    qLimit: number,
    qOffset?: number
  ) => ({
    ...filters,
    ...order,
    offset: qOffset,
    limit: qLimit,
  });

  const { data, isLoading: isLoading } = client
    .ref("[GET]/restitution-intentions/demandes")
    .useQuery(
      {
        query: getIntentionsStatsQueryParameters(PAGE_SIZE, page * PAGE_SIZE),
      },
      {
        keepPreviousData: true,
        staleTime: 10000000,
      }
    );

  const { data: countData, isLoading: isLoadingCount } = client
    .ref("[GET]/restitution-intentions/stats")
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

  const { codeRegionFilter, setCodeRegionFilter } = useContext(
    CodeRegionFilterContext
  );

  const [rentreeScolaireFilter, setRentreeScolaireFilter] = useState<string>();
  const [campagneFilter, setCampagneFilter] = useState<string>(
    CURRENT_ANNEE_CAMPAGNE
  );

  const [statutFilter, setStatutFilter] = useState<
    ("draft" | "submitted" | "refused")[] | undefined
  >([DemandeStatutEnum.draft, DemandeStatutEnum.submitted]);

  useEffect(() => {
    if (
      filters?.codeRegion === undefined &&
      filters?.codeAcademie === undefined &&
      filters?.codeDepartement === undefined &&
      codeRegionFilter !== ""
    ) {
      filters.codeRegion = [codeRegionFilter];
    }
    if (filters?.campagne === undefined && campagneFilter !== "") {
      filters.campagne = campagneFilter;
    }
    if (
      filters?.rentreeScolaire === undefined &&
      rentreeScolaireFilter !== ""
    ) {
      filters.rentreeScolaire = rentreeScolaireFilter;
    }
    if (filters?.statut === undefined && statutFilter !== undefined) {
      filters.statut = statutFilter;
    }
    setSearchParams({ filters: filters });
  }, []);

  return (
    <GuardPermission permission="restitution-intentions/lecture">
      <Container maxWidth={"100%"} h={"100%"} py="4" pt={8} bg="blueecume.925">
        <HeaderSection
          countData={countData}
          activeFilters={filters}
          handleFilters={handleFilters}
          filterTracker={filterTracker}
          isLoading={isLoading || isLoadingCount}
          data={data}
        />
        <TableHeader
          pl="4"
          onExportCsv={async () => {
            trackEvent("restitution-demandes:export");
            const data = await client
              .ref("[GET]/restitution-intentions/demandes")
              .query({
                query: getIntentionsStatsQueryParameters(EXPORT_LIMIT),
              });
            downloadCsv(
              "demandes_stats_export",
              data.demandes.map((demande) => ({
                ...demande,
                createdAt: new Date(demande.createdAt).toLocaleDateString(
                  "fr-FR",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                ),
                updatedAt: new Date(demande.updatedAt).toLocaleDateString(
                  "fr-FR",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                ),
                disciplinesRecrutementRH:
                  demande.discipline1RecrutementRH &&
                  `${demande.discipline1RecrutementRH} ${
                    demande.discipline2RecrutementRH
                      ? `- ${demande.discipline2RecrutementRH}`
                      : ""
                  }`,
                disciplinesReconversionRH:
                  demande.discipline1ReconversionRH &&
                  `${demande.discipline1ReconversionRH} ${
                    demande.discipline2ReconversionRH
                      ? `- ${demande.discipline2ReconversionRH}`
                      : ""
                  }`,
                disciplinesFormationRH:
                  demande.discipline1FormationRH &&
                  `${demande.discipline1FormationRH} ${
                    demande.discipline2FormationRH
                      ? `- ${demande.discipline2FormationRH}`
                      : ""
                  }`,
                disciplinesProfesseurAssocieRH:
                  demande.discipline1ProfesseurAssocieRH &&
                  `${demande.discipline1ProfesseurAssocieRH} ${
                    demande.discipline2ProfesseurAssocieRH
                      ? `- ${demande.discipline2ProfesseurAssocieRH}`
                      : ""
                  }`,
              })),
              STATS_DEMANDES_COLUMNS
            );
          }}
          onExportExcel={async () => {
            trackEvent("restitution-demandes:export-excel");
            const data = await client
              .ref("[GET]/restitution-intentions/demandes")
              .query({
                query: getIntentionsStatsQueryParameters(EXPORT_LIMIT),
              });
            downloadExcel(
              "demandes_stats_export",
              data.demandes.map((demande) => ({
                ...demande,
                createdAt: new Date(demande.createdAt).toLocaleDateString(
                  "fr-FR",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                ),
                updatedAt: new Date(demande.updatedAt).toLocaleDateString(
                  "fr-FR",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                ),
              })),
              STATS_DEMANDES_COLUMNS
            );
          }}
          page={page}
          pageSize={PAGE_SIZE}
          count={data?.count}
          onPageChange={(newPage) => setSearchParams({ page: newPage })}
        />
        <ConsoleSection
          data={data}
          isLoading={isLoading}
          handleOrder={handleOrder}
          order={order}
        />
      </Container>
    </GuardPermission>
  );
};
