"use client";

import { Button, chakra, Container, Flex, MenuButton } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import _ from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";
import { useContext, useEffect, useState } from "react";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import { client } from "@/api.client";
import { CodeDepartementContext } from "@/app/codeDepartementContext";
import { CodeRegionContext } from "@/app/codeRegionContext";
import { GroupedMultiselect } from "@/components/GroupedMultiselect";
import { SearchInput } from "@/components/SearchInput";
import { TableHeader } from "@/components/TableHeader";
import { createParameterizedUrl } from "@/utils/createParameterizedUrl";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";
import { formatExportFilename } from "@/utils/formatExportFilename";
import { GuardPermission } from "@/utils/security/GuardPermission";

import { ConsoleSection } from "./ConsoleSection/ConsoleSection";
import { GROUPED_STATS_DEMANDES_COLUMNS_OPTIONAL } from "./GROUPED_STATS_DEMANDES_COLUMN";
import { HeaderSection } from "./HeaderSection/HeaderSection";
import type { STATS_DEMANDES_COLUMNS_OPTIONAL } from "./STATS_DEMANDES_COLUMN";
import { STATS_DEMANDES_COLUMNS, STATS_DEMANDES_COLUMNS_DEFAULT } from "./STATS_DEMANDES_COLUMN";
import type {
  DemandesRestitutionIntentions,
  FiltersDemandesRestitutionIntentions,
  OrderDemandesRestitutionIntentions,
} from "./types";

const ColonneFiltersSection = chakra(
  ({
    colonneFilters,
    handleColonneFilters,
  }: {
    colonneFilters: (keyof typeof STATS_DEMANDES_COLUMNS_OPTIONAL)[];
    handleColonneFilters: (value: (keyof typeof STATS_DEMANDES_COLUMNS_OPTIONAL)[]) => void;
  }) => {
    return (
      <Flex justifyContent={"start"} direction="row">
        <GroupedMultiselect
          width={"48"}
          size="md"
          variant={"newInput"}
          onChange={(selected) => handleColonneFilters(selected as (keyof typeof STATS_DEMANDES_COLUMNS_OPTIONAL)[])}
          groupedOptions={Object.entries(GROUPED_STATS_DEMANDES_COLUMNS_OPTIONAL).reduce(
            (acc, [group, { color, options }]) => {
              acc[group] = {
                color,
                options: Object.entries(options).map(([value, label]) => ({
                  label,
                  value,
                })),
              };
              return acc;
            },
            {} as Record<string, { color: string; options: { label: string; value: string }[] }>
          )}
          defaultOptions={Object.entries(STATS_DEMANDES_COLUMNS_DEFAULT)?.map(([value, label]) => {
            return {
              label,
              value,
            };
          })}
          value={colonneFilters ?? []}
          customButton={
            <MenuButton as={Button} variant={"externalLink"} leftIcon={<Icon icon={"ri:table-line"} />} color="bluefrance.113">
              Modifier l'affichage des colonnes
            </MenuButton>
          }
        />
      </Flex>
    );
  }
);

const PAGE_SIZE = 30;

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default () => {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<FiltersDemandesRestitutionIntentions>;
    columns?: (keyof typeof STATS_DEMANDES_COLUMNS_OPTIONAL)[];
    order?: Partial<OrderDemandesRestitutionIntentions>;
    page?: string;
    search?: string;
  } = qs.parse(queryParams.toString(), { arrayLimit: Infinity });

  const filters = searchParams.filters ?? {};
  const columns = searchParams.columns ?? [];
  const order = searchParams.order ?? { order: "asc" };
  const page = searchParams.page ? parseInt(searchParams.page) : 0;
  const search = searchParams.search ?? "";

  const setSearchParams = (params: {
    filters?: typeof filters;
    columns?: typeof columns;
    order?: typeof order;
    page?: typeof page;
    search?: typeof search;
  }) => {
    router.replace(createParameterizedUrl(location.pathname, { ...searchParams, ...params }));
  };

  const trackEvent = usePlausible();
  const filterTracker = (filterName: keyof FiltersDemandesRestitutionIntentions) => () => {
    trackEvent("restitution-demandes:filtre", {
      props: { filter_name: filterName },
    });
  };

  const handleOrder = (column: OrderDemandesRestitutionIntentions["orderBy"]) => {
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
        setCodeRegion((value as string[])[0] ?? "");
        break;
      case "codeDepartement":
        setCodeDepartement((value as string[])[0] ?? "");
        break;
      case "rentreeScolaire":
        setRentreeScolaireFilter((value as string[])[0] ?? "");
        break;
      case "campagne":
        setCampagneFilter((value as string[])[0] ?? "");
        break;
      case "statut":
        setStatutFilter(value as Exclude<DemandeStatutType, "supprimée">[]);
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

  const handleColonneFilters = (value: (keyof typeof STATS_DEMANDES_COLUMNS_OPTIONAL)[]) => {
    setSearchParams({ columns: value });
    setColonneFilters(value);
  };

  const resetFilters = () => {
    setSearchParams({
      filters: {
        ...filters,
        codeNsf: [],
        cfd: [],
        codeNiveauDiplome: [],
        codeDepartement: [],
        uai: [],
        secteur: undefined,
        statut: statutFilter,
        typeDemande: [],
        voie: undefined,
        coloration: undefined,
        amiCMA: undefined,
      },
      search: "",
    });
  };

  const getIntentionsStatsQueryParameters = (qLimit?: number, qOffset?: number) => ({
    ...filters,
    ...order,
    search,
    offset: qOffset,
    limit: qLimit,
  });

  const { data, isLoading } = client.ref("[GET]/restitution-intentions/demandes").useQuery(
    {
      query: getIntentionsStatsQueryParameters(PAGE_SIZE, page * PAGE_SIZE),
    },
    {
      keepPreviousData: true,
      staleTime: 10000000,
    }
  );

  const { data: countData, isLoading: isLoadingCount } = client.ref("[GET]/restitution-intentions/stats").useQuery(
    {
      query: {
        ...filters,
        search,
      },
    },
    {
      keepPreviousData: true,
      staleTime: 10000000,
    }
  );

  const { codeRegion, setCodeRegion } = useContext(CodeRegionContext);
  const { codeDepartement, setCodeDepartement } = useContext(CodeDepartementContext);

  const [rentreeScolaireFilter, setRentreeScolaireFilter] = useState<string>();

  const [campagneFilter, setCampagneFilter] = useState<string>(CURRENT_ANNEE_CAMPAGNE);

  const [colonneFilters, setColonneFilters] = useState<(keyof typeof STATS_DEMANDES_COLUMNS_OPTIONAL)[]>(
    (columns.length
      ? columns
      : Object.keys(STATS_DEMANDES_COLUMNS_DEFAULT)) as (keyof typeof STATS_DEMANDES_COLUMNS_DEFAULT)[]
  );

  const [statutFilter, setStatutFilter] = useState<Exclude<DemandeStatutType, "supprimée">[] | undefined>();

  const [searchIntention, setSearchIntention] = useState<string>(search);

  const setDefaultFilters = () => {
    if (
      filters?.codeRegion === undefined &&
      filters?.codeAcademie === undefined &&
      filters?.codeDepartement === undefined &&
      codeRegion
    ) {
      filters.codeRegion = [codeRegion];
    }
    if (
      filters?.codeRegion === undefined &&
      filters?.codeAcademie === undefined &&
      filters?.codeDepartement === undefined &&
      codeDepartement
    ) {
      filters.codeDepartement = [codeDepartement];
    }
    if (filters?.campagne === undefined && campagneFilter !== "") {
      filters.campagne = campagneFilter;
    }
    if (filters?.rentreeScolaire === undefined && rentreeScolaireFilter !== "") {
      filters.rentreeScolaire = rentreeScolaireFilter;
    }

    if (filters?.statut === undefined) {
      // Par défaut on affiche les demandes avec tous les status, sauf : supprimée, brouillon et refusée.
      filters.statut = _.values(DemandeStatutEnum).filter(
        (statut) =>
          statut !== DemandeStatutEnum["supprimée"] &&
          statut !== DemandeStatutEnum["brouillon"] &&
          statut !== DemandeStatutEnum["refusée"]
      ) as Exclude<DemandeStatutType, "supprimée">[];
    }
    setSearchParams({ filters: filters });
  };

  const getDataForExport = (data: DemandesRestitutionIntentions) => {
    const region = data.filters.regions.find((r) => r.value === filters.codeRegion?.[0]);

    const academies = data.filters.academies.filter((a) => filters.codeAcademie?.includes(a.value) ?? false);

    const departements = data.filters.departements.filter((d) => filters.codeDepartement?.includes(d.value) ?? false);

    const regionsColumns = {
      selectedCodeRegion: "Code Région sélectionné",
      selectedRegion: "Région sélectionnée",
    };
    const academiesColumns = {
      selectedCodeAcademie: "Code Académie sélectionné",
      selectedAcademie: "Académie sélectionnée",
    };
    const departementsColumns = {
      selectedCodeDepartement: "Code Département sélectionné",
      selectedDepartement: "Departement sélectionnée",
    };

    const columns = {
      ...STATS_DEMANDES_COLUMNS,
      ...(filters.codeRegion && region ? regionsColumns : {}),
      ...(filters.codeAcademie && academies ? academiesColumns : {}),
      ...(filters.codeDepartement && departements ? departementsColumns : {}),
    };

    let demandes = [];

    demandes = data.demandes.map((demande) => ({
      ...demande,
      createdAt: new Date(demande.createdAt).toLocaleDateString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      updatedAt: new Date(demande.updatedAt).toLocaleDateString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      disciplinesRecrutementRH:
        demande.discipline1RecrutementRH &&
        `${demande.discipline1RecrutementRH} ${
          demande.discipline2RecrutementRH ? `- ${demande.discipline2RecrutementRH}` : ""
        }`,
      disciplinesReconversionRH:
        demande.discipline1ReconversionRH &&
        `${demande.discipline1ReconversionRH} ${
          demande.discipline2ReconversionRH ? `- ${demande.discipline2ReconversionRH}` : ""
        }`,
      disciplinesFormationRH:
        demande.discipline1FormationRH &&
        `${demande.discipline1FormationRH} ${
          demande.discipline2FormationRH ? `- ${demande.discipline2FormationRH}` : ""
        }`,
      disciplinesProfesseurAssocieRH:
        demande.discipline1ProfesseurAssocieRH &&
        `${demande.discipline1ProfesseurAssocieRH} ${
          demande.discipline2ProfesseurAssocieRH ? `- ${demande.discipline2ProfesseurAssocieRH}` : ""
        }`,
      secteur: demande.secteur === "PU" ? "Public" : "Privé",
      actionPrioritaire: demande.formationSpecifique[TypeFormationSpecifiqueEnum["Action prioritaire"]],
      transitionDemographique: demande.formationSpecifique[TypeFormationSpecifiqueEnum["Transition démographique"]],
      transitionEcologique: demande.formationSpecifique[TypeFormationSpecifiqueEnum["Transition écologique"]],
      transitionNumerique: demande.formationSpecifique[TypeFormationSpecifiqueEnum["Transition numérique"]],
    }));

    return {
      columns,
      demandes,
    };
  };

  const onExportCsv = async (isFiltered?: boolean) => {
    trackEvent("restitution-demandes:export");
    const data = await client.ref("[GET]/restitution-intentions/demandes").query({
      query: isFiltered ? getIntentionsStatsQueryParameters() : {},
    });

    const { columns, demandes } = getDataForExport(data);
    downloadCsv(formatExportFilename("restitution_export"), demandes, columns);
  };

  const onExportExcel = async (isFiltered?: boolean) => {
    trackEvent("restitution-demandes:export-excel");
    const data = await client.ref("[GET]/restitution-intentions/demandes").query({
      query: isFiltered ? getIntentionsStatsQueryParameters() : {},
    });

    const { columns, demandes } = getDataForExport(data);
    downloadExcel(formatExportFilename("restitution_export"), demandes, columns);
  };

  useEffect(() => {
    setDefaultFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickSearch = () => {
    setSearchParams({
      filters: filters,
      order: order,
      search: searchIntention,
    });
  };

  useEffect(() => {
    const campagneFilterNumber = parseInt(searchParams.filters?.campagne ?? "");
    handleFilters("rentreeScolaire", campagneFilterNumber + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.filters?.campagne]);

  return (
    <GuardPermission permission="restitution-intentions/lecture">
      <Container maxWidth={"100%"} pt={8} bg="blueecume.925" pb={20} flex={1}>
        <HeaderSection
          countData={countData}
          activeFilters={filters}
          handleFilters={handleFilters}
          filterTracker={filterTracker}
          resetFilters={resetFilters}
          isLoading={isLoading || isLoadingCount}
          data={data}
        />
        <TableHeader
          SearchInput={
            <SearchInput
              placeholder="Rechercher un numéro, établissement, formation..."
              onChange={setSearchIntention}
              value={searchIntention}
              onClick={onClickSearch}
            />
          }
          ColonneFilter={
            <ColonneFiltersSection colonneFilters={colonneFilters} handleColonneFilters={handleColonneFilters} />
          }
          onExportCsv={onExportCsv}
          onExportExcel={onExportExcel}
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
          colonneFilters={colonneFilters}
        />
      </Container>
    </GuardPermission>
  );
};
