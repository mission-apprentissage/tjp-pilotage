"use client";

import {Button, Center, chakra, Flex, MenuButton,Spinner, useDisclosure} from '@chakra-ui/react';
import { Icon } from "@iconify/react";
import _ from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import { parse } from "qs";
import { useContext, useEffect, useState } from "react";
import { CURRENT_RENTREE } from 'shared';
import type { TypeDemandeType } from 'shared/enum/demandeTypeEnum';
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";
import type { UserType } from 'shared/schema/userSchema';

import { client } from "@/api.client";
import { CreateRequeteEnregistreeModal } from "@/app/(wrapped)/console/components/CreateRequeteEnregistreeModal";
import { CodeDepartementContext } from '@/app/codeDepartementContext';
import { CodeRegionContext } from '@/app/codeRegionContext';
import { UaisContext } from '@/app/uaiContext';
import { formatTypeFamilleLong } from '@/components/BadgeTypeFamille';
import { ConsoleSearchInput } from "@/components/ConsoleSearchInput";
import { GroupedMultiselect } from "@/components/GroupedMultiselect";
import { TableHeader } from "@/components/TableHeader";
import { createParameterizedUrl } from "@/utils/createParameterizedUrl";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";
import { formatExportFilename } from "@/utils/formatExportFilename";
import {formatLibelleFormationWithoutTags, formatTypeDemande} from '@/utils/formatLibelle';
import { formatArray } from "@/utils/formatUtils";
import { useAuth } from '@/utils/security/useAuth';

import { ConsoleSection } from "./ConsoleSection/ConsoleSection";
import {
  FORMATION_ETABLISSEMENT_COLUMNS,
  FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED,
  FORMATION_ETABLISSEMENT_COLUMNS_DEFAULT,
  FORMATION_ETABLISSEMENT_COLUMNS_DEFAULT_CONNECTED,
} from "./FORMATION_ETABLISSEMENT_COLUMNS";
import { GROUPED_FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL, GROUPED_FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL_CONNECTED } from "./GROUPED_FORMATION_ETABLISSEMENT_COLUMNS";
import { HeaderSection } from "./HeaderSection/HeaderSection";
import { SideSection } from "./SideSection/SideSection";
import type { Filters, FORMATION_ETABLISSEMENT_COLUMNS_KEYS, Order } from "./types";

const PAGE_SIZE = 30;

type QueryResult = (typeof client.infer)["[GET]/etablissements"];

const ColonneFilterSection = chakra(
  ({
    colonneFilters,
    forcedColonnes,
    handleColonneFilters,
    trackEvent,
    user,
  }: {
    colonneFilters: FORMATION_ETABLISSEMENT_COLUMNS_KEYS[];
    forcedColonnes?: FORMATION_ETABLISSEMENT_COLUMNS_KEYS[];
    handleColonneFilters: (value: FORMATION_ETABLISSEMENT_COLUMNS_KEYS[]) => void;
    trackEvent: (name: string, params?: Record<string, unknown>) => void;
    user?: UserType;
  }) => {

    const groupedOptions = user
      ? Object.entries(GROUPED_FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL_CONNECTED)
      : Object.entries(GROUPED_FORMATION_ETABLISSEMENT_COLUMNS_OPTIONAL);

    const options = user
      ? Object.entries(FORMATION_ETABLISSEMENT_COLUMNS_DEFAULT_CONNECTED)
      : Object.entries(FORMATION_ETABLISSEMENT_COLUMNS_DEFAULT);

    return (
      <Flex justifyContent={"start"} direction="row">
        <GroupedMultiselect
          width={"48"}
          size="md"
          variant={"newInput"}
          onChange={(selected) => handleColonneFilters(selected as FORMATION_ETABLISSEMENT_COLUMNS_KEYS[])}
          groupedOptions={groupedOptions.reduce(
            (acc, [group, { color, options }]) => {
              acc[group] = {
                color,
                options: Object.entries(options).map(([value, label]) => ({
                  label,
                  value,
                  isDisabled: forcedColonnes?.includes(value as FORMATION_ETABLISSEMENT_COLUMNS_KEYS),
                })),
              };
              return acc;
            },
          {} as Record<
            string,
            {
              color: string;
              options: { label: string; value: string; disabled?: boolean }[];
            }
          >
          )}
          defaultOptions={options?.map(([value, label]) => {
            return {
              label,
              value,
            };
          })}
          value={colonneFilters ?? []}
          customButton={
            <MenuButton
              as={Button}
              variant={"externalLink"}
              leftIcon={<Icon icon={"ri:table-line"} />}
              color="bluefrance.113"
              onClick={() => trackEvent("etablissements:affichage-colonnes")}
            >
            Modifier les colonnes
            </MenuButton>
          }
        />
      </Flex>
    );
  }
);

const Page = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const trackEvent = usePlausible();
  const router = useRouter();
  const queryParams = useSearchParams();
  const { auth, user } = useAuth();
  const searchParams: {
    filters?: Partial<Filters>;
    search?: string;
    columns?: FORMATION_ETABLISSEMENT_COLUMNS_KEYS[];
    order?: Partial<Order>;
    page?: string;
  } = parse(queryParams.toString(), { arrayLimit: Infinity });

  const setSearchParams = (params: {
    filters?: typeof filters;
    search?: typeof search;
    columns?: typeof columns;
    order?: typeof order;
    page?: typeof page;
  }) => {
    router.replace(createParameterizedUrl(location.pathname, { ...searchParams, ...params }));
  };

  const filters = searchParams.filters ?? {};
  const columns = searchParams.columns ?? [];
  const order = searchParams.order ?? { order: "asc" };
  const page = searchParams.page ? parseInt(searchParams.page) : 0;
  const search = searchParams.search ?? "";

  const [searchFormationEtablissement, setSearchFormationEtablissement] = useState<string>(search);

  const [requeteEnregistreeActuelle, setRequeteEnregistreeActuelle] = useState<{
    nom: string;
    couleur?: string;
  }>({ nom: "Requêtes favorites" });

  const getEtablissementsQueryParameters = (qLimit?: number, qOffset?: number) => ({
    ...order,
    ...filters,
    search,
    offset: qOffset,
    limit: qLimit,
  });

  const { data, isLoading } = client.ref("[GET]/etablissements").useQuery(
    {
      query: getEtablissementsQueryParameters(PAGE_SIZE, page * PAGE_SIZE),
    },
    {
      enabled: !!filters.rentreeScolaire,
      staleTime: 10000000,
    }
  );

  const { data: requetesEnregistrees } = client.ref("[GET]/requetes").useQuery({
    query: { page: "formationEtablissement" }
  }, {
    enabled: !!auth?.user
  });

  const getDataForExport = (data: QueryResult) => {
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
      ..._.omit(user ? FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED : FORMATION_ETABLISSEMENT_COLUMNS, "formationSpecifique"),
      ...(filters.codeRegion && region ? regionsColumns : {}),
      ...(filters.codeAcademie && academies ? academiesColumns : {}),
      ...(filters.codeDepartement && departements ? departementsColumns : {}),
    };

    let etablissements = [];

    etablissements = data.etablissements.map((etablissement) => ({
      ..._.pick(etablissement, Object.keys(FORMATION_ETABLISSEMENT_COLUMNS)),
      ...(filters.codeRegion && region
        ? {
          selectedCodeRegion: region.value,
          selectedRegion: region.label,
        }
        : {}),
      ...(filters.codeAcademie && academies
        ? {
          selectedCodeAcademie: formatArray(academies.map((academie) => academie.value)),

          selectedAcademie: formatArray(academies.map((academie) => academie.label)),
        }
        : {}),
      ...(filters.codeDepartement && departements
        ? {
          selectedCodeDepartement: formatArray(departements.map((departement) => departement.value)),

          selectedDepartement: formatArray(departements.map((departement) => departement.label)),
        }
        : {}),
      actionPrioritaire: etablissement.formationSpecifique[TypeFormationSpecifiqueEnum["Action prioritaire"]],
      libelleFormation: formatLibelleFormationWithoutTags(etablissement),
      typeFamille: formatTypeFamilleLong(etablissement.typeFamille),
      isFormationRenovee: etablissement.isFormationRenovee,
      isHistorique: !!etablissement.formationRenovee,
      isHistoriqueCoExistant: etablissement.isHistoriqueCoExistant,
      ...user && {
        ...etablissement,
        typeDemande: etablissement.typeDemande
          ? etablissement.typeDemande
            .split(" ,")
            .map((typeDemande) => formatTypeDemande(typeDemande as TypeDemandeType))
            .join(", ")
          : undefined
      }
    }));

    return {
      columns,
      etablissements,
    };
  };

  const onExportCsv = async (isFiltered?: boolean) => {
    trackEvent("etablissements:export");
    const data = await client.ref("[GET]/etablissements").query({
      query: isFiltered ? getEtablissementsQueryParameters() : {},
    });

    const { columns, etablissements } = getDataForExport(data);

    downloadCsv(formatExportFilename("etablissement_export"), etablissements, columns);
  };

  const onExportExcel = async (isFiltered?: boolean) => {
    trackEvent("etablissements:export-excel");
    const data = await client.ref("[GET]/etablissements").query({
      query: isFiltered ? getEtablissementsQueryParameters() : {},
    });

    const { columns, etablissements } = getDataForExport(data);

    downloadExcel(formatExportFilename("etablissement_export"), etablissements, columns);
  };

  const defaultColumns = (user ?
    Object.keys(FORMATION_ETABLISSEMENT_COLUMNS_DEFAULT_CONNECTED)
    : Object.keys(FORMATION_ETABLISSEMENT_COLUMNS_DEFAULT)) as FORMATION_ETABLISSEMENT_COLUMNS_KEYS[];

  const [colonneFilters, setColonneFilters] = useState<FORMATION_ETABLISSEMENT_COLUMNS_KEYS[]>(
    (columns.length
      ? columns
      : defaultColumns
    )
  );

  const handleColonneFilters = (value: FORMATION_ETABLISSEMENT_COLUMNS_KEYS[]) => {
    setSearchParams({ columns: value });
    setColonneFilters(value);
  };

  const onSearch = () => {
    setSearchParams({
      filters: filters,
      order: order,
      search: searchFormationEtablissement,
    });
  };

  const { codeRegion, setCodeRegion } = useContext(CodeRegionContext);
  const { codeDepartement, setCodeDepartement } = useContext(CodeDepartementContext);
  const { uais } = useContext(UaisContext);
  const rentreeScolaire = CURRENT_RENTREE;

  const filterTracker = (filterName: keyof Filters) => () => {
    trackEvent("etablissements:filtre", { props: { filter_name: filterName } });
  };

  const handleFiltersContext = (type: keyof Filters, value: Filters[keyof Filters]) => {
    if (type === "codeRegion" && value != null) setCodeRegion((value as string[])[0] ?? "");

    if (type === "codeDepartement" && value != null) setCodeDepartement((value as string[])[0] ?? "");
  };

  const handleFilters = (type: keyof Filters, value: Filters[keyof Filters]) => {
    handleFiltersContext(type, value);

    let newFilters: Partial<Filters> = {
      [type]: value,
    };

    // Valeurs par défaut pour les codes
    switch (type) {
    case "codeRegion":
      if (value !== undefined) {
        newFilters = {
          ...newFilters,
          codeAcademie: undefined,
          codeDepartement: undefined,
          commune: undefined,
          secteur: [],
          uai: [],
        };
      }
      break;
    case "codeAcademie":
      if (value !== undefined) {
        newFilters = {
          ...newFilters,
          codeDepartement: undefined,
          commune: undefined,
          secteur: [],
          uai: [],
        };
      }
      break;
    case "codeDepartement":
      if (value !== undefined) {
        newFilters = {
          ...newFilters,
          commune: undefined,
          secteur: [],
          uai: [],
        };
      }
      break;
    case "commune":
      if (value !== undefined) {
        newFilters = {
          ...newFilters,
          secteur: [],
          uai: [],
        };
      }
      break;
    case "secteur":
      if (value !== undefined) {
        newFilters = {
          ...newFilters,
          uai: [],
        };
      }
      break;
    }

    filterTracker(type)();
    setSearchParams({
      page: 0,
      filters: { ...filters, ...newFilters },
    });
    setRequeteEnregistreeActuelle({ nom: "Requêtes favorites" });
  };

  useEffect(() => {
    if (codeRegion && !filters.codeRegion?.length) {
      filters.codeRegion = [codeRegion];
      setSearchParams({ filters: filters });
    }
    if (codeDepartement && !filters.codeDepartement?.length) {
      filters.codeDepartement = [codeDepartement];
      setSearchParams({ filters: filters });
    }
    if (uais && uais.length && !filters.uai?.length) {
      filters.uai = uais;
      setSearchParams({ filters: filters });
    }
    if(rentreeScolaire && !filters.rentreeScolaire?.length) {
      filters.rentreeScolaire = [rentreeScolaire];
      setSearchParams({ filters: filters });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <HeaderSection
        setSearchParams={setSearchParams}
        searchParams={searchParams}
        handleFilters={handleFilters}
        filtersList={data?.filters}
        requetesEnregistrees={requetesEnregistrees}
        requeteEnregistreeActuelle={requeteEnregistreeActuelle}
        setRequeteEnregistreeActuelle={setRequeteEnregistreeActuelle}
      />
      <Flex direction={"row"} flex={1} position="relative" minH="0">
        <SideSection searchParams={searchParams} filtersList={data?.filters} handleFilters={handleFilters} />
        <Flex direction="column" flex={1} position="relative" minW={0}>
          <TableHeader
            p={4}
            SaveFiltersButton={
              <Flex py="2">
                <Button
                  variant={"externalLink"}
                  leftIcon={<Icon icon="ri:save-3-line" />}
                  onClick={() => {
                    onOpen();
                  }}
                >
                  Enregistrer la requête
                </Button>
              </Flex>
            }
            SearchInput={
              <ConsoleSearchInput
                placeholder="Rechercher dans les résultats"
                onChange={(newValue) => {
                  const oldValue = searchFormationEtablissement;
                  setSearchFormationEtablissement(newValue);
                  if (newValue.length > 2 || oldValue.length > newValue.length) {
                    onSearch();
                  }
                }}
                value={searchFormationEtablissement}
                onClick={onSearch}
                width={{ base: "15rem", ["2xl"]: "25rem" }}
              />
            }
            ColonneFilter={
              <ColonneFilterSection
                colonneFilters={colonneFilters}
                handleColonneFilters={handleColonneFilters}
                forcedColonnes={["libelleEtablissement", "libelleFormation"]}
                trackEvent={trackEvent}
                user={user}
              />
            }
            onExportCsv={onExportCsv}
            onExportExcel={onExportExcel}
            page={page}
            pageSize={PAGE_SIZE}
            count={data?.count}
            onPageChange={(newPage) => setSearchParams({ page: newPage })}
          />
          {isLoading && (
            <Center height="100%" width="100%" position="absolute" bg="rgb(255,255,255,0.8)" zIndex="1">
              <Spinner />
            </Center>
          )}
          <ConsoleSection
            data={data}
            filters={filters}
            order={order}
            setSearchParams={setSearchParams}
            colonneFilters={colonneFilters}
            user={user}
          />
        </Flex>
      </Flex>
      {isOpen && (
        <CreateRequeteEnregistreeModal
          isOpen={isOpen}
          onClose={onClose}
          searchParams={searchParams}
          filtersList={data?.filters}
          page="formationEtablissement"
        />
      )}
    </>
  );
};

export default Page;
