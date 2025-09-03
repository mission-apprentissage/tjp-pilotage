"use client";

import { Button, Center, chakra, Flex, MenuButton,Text, Tooltip, useToast } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import NextLink from "next/link";
import { usePlausible } from "next-plausible";
import { useEffect, useState } from "react";
import { hasPermission } from "shared";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { PermissionEnum } from "shared/enum/permissionEnum";
import type { OptionType } from "shared/schema/optionSchema";

import { client } from "@/api.client";
import { getMessageAccompagnementCampagne } from "@/app/(wrapped)/demandes/utils/messageAccompagnementUtils";
import { ConsoleSearchInput } from "@/components/ConsoleSearchInput";
import { GroupedMultiselect } from "@/components/GroupedMultiselect";
import { TableHeader } from "@/components/TableHeader";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";
import { formatExportFilename } from "@/utils/formatExportFilename";
import { formatLibellesColoration } from "@/utils/formatLibelle";
import { getRoutingAccessSaisieDemande } from "@/utils/getRoutingAccesDemande";
import { canCreateDemande } from "@/utils/permissionsDemandeUtils";
import { useAuth } from "@/utils/security/useAuth";
import { useCurrentCampagne } from "@/utils/security/useCurrentCampagne";
import { useStateParams } from "@/utils/useFilters";

import { DemandeSpinner } from "./components/DemandeSpinner";
import { FiltersSection } from "./components/FiltersSection";
import { SideSection } from "./components/SideSection";
import { ConsoleSection } from "./consoleSection/ConsoleSection";
import { DEMANDES_COLUMNS, DEMANDES_COLUMNS_DEFAULT } from "./DEMANDES_COLUMNS";
import { GROUPED_DEMANDES_COLUMNS_OPTIONAL } from "./GROUPED_DEMANDES_COLUMNS";
import type { DEMANDES_COLUMNS_KEYS, Filters, Order } from "./types";

const PAGE_SIZE = 30;

export type CheckedDemandesType = {
  statut: DemandeStatutType;
  demandes: Array<string>;
};

export interface ISearchParams {
  filters?: Partial<Filters>;
  columns?: Array<DEMANDES_COLUMNS_KEYS>;
  order?: Partial<Order>;
  page?: string;
  action?: Exclude<DemandeStatutType, "supprimée">;
  notfound?: string;
}

const ColonneFilterSection = chakra(
  ({
    colonneFilters,
    forcedColonnes,
    handleColonneFilters,
    trackEvent,
  }: {
    colonneFilters: Array<DEMANDES_COLUMNS_KEYS>;
    forcedColonnes?: Array<DEMANDES_COLUMNS_KEYS>;
    handleColonneFilters: (value: Array<DEMANDES_COLUMNS_KEYS>) => void;
    trackEvent: (name: string, params?: Record<string, unknown>) => void;
  }) =>
    <Flex justifyContent={"start"} direction="row">
      <GroupedMultiselect
        width={"48"}
        size="md"
        variant={"newInput"}
        onChange={(selected) => handleColonneFilters(selected as Array<DEMANDES_COLUMNS_KEYS>)}
        groupedOptions={Object.entries(GROUPED_DEMANDES_COLUMNS_OPTIONAL).reduce(
          (acc, [group, { color, options }]) => {
            acc[group] = {
              color,
              options: Object.entries(options)
                .map(([value, label]) => ({
                  label,
                  value,
                  isDisabled: forcedColonnes?.includes(value as DEMANDES_COLUMNS_KEYS),
                }))
            };
            return acc;
          },
          {} as Record<
            string,
            {
              color: string;
              options: (OptionType & { disabled?: boolean })[];
            }
          >
        )}
        defaultOptions={Object.entries(DEMANDES_COLUMNS)?.map(([value, label]) => {
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
            onClick={() => trackEvent("demandes:affichage-colonnes")}
          >
            Modifier les colonnes
          </MenuButton>
        }
      />
    </Flex>
);

export const PageClient = () => {
  const { user } = useAuth();
  const { campagne: currentCampagne } = useCurrentCampagne();
  const toast = useToast();

  const [searchParams, setSearchParams] = useStateParams<ISearchParams>({
    defaultValues: {
      filters: {},
      order: { order: "asc" },
      page: "0",
    },
  });

  const filters = searchParams.filters ?? {};
  const columns = searchParams.columns ?? [];
  const search = searchParams.filters?.search ?? "";
  const order = searchParams.order ?? { order: "asc" };
  const page = searchParams.page ? parseInt(searchParams.page) : 0;
  const notFound = searchParams.notfound;

  useEffect(() => {
    if (notFound && !toast.isActive("not-found")) {
      toast({
        id: "not-found",
        status: "error",
        variant: "left-accent",
        title: `La demande ${notFound} n'a pas été trouvée`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notFound]);

  const trackEvent = usePlausible();

  const filterTracker = (filterName: keyof Filters) => () => {
    trackEvent("demandes:filtre", {
      props: { filter_name: filterName },
    });
  };

  const handleFilters = (type: keyof Filters, value: Filters[keyof Filters]) => {
    setSearchParams({
      ...searchParams,
      filters: { ...searchParams.filters, [type]: value },
    });
  };

  const handleOrder = (column: Order["orderBy"]) => {
    trackEvent("demandes:ordre", { props: { colonne: column } });

    const newOrder = {
      order: order?.orderBy === column && order?.order === "asc" ? "desc" : ("asc" as "asc" | "desc"),
      orderBy: column,
    };

    setSearchParams({
      ...searchParams,
      order: newOrder,
    });
  };

  const getDemandesQueryParameters = (qLimit?: number, qOffset?: number) => ({
    ...searchParams.filters,
    ...order,
    offset: qOffset,
    limit: qLimit,
  });

  const { data, isLoading } = client.ref("[GET]/demandes").useQuery(
    {
      query: getDemandesQueryParameters(PAGE_SIZE, page * PAGE_SIZE),
    },
    { cacheTime: 0, keepPreviousData: true }
  );

  const [isModifyingGroup, setIsModifyingGroup] = useState(false);

  const [searchFormation, setSearchFormation] = useState<string>(search);

  const onSearch = (searchValue?: string) => {
    setSearchParams({
      filters: {
        ...filters,
        search: searchValue ?? searchFormation,
      },
      order: order,
    });
  };
  const onExportCsv = async (isFiltered?: boolean) => {
    trackEvent("saisie_demandes:export");
    const data = await client.ref("[GET]/demandes").query({
      query: isFiltered ? getDemandesQueryParameters() : {},
    });
    downloadCsv(
      formatExportFilename("recueil_demandes"),
      [
        ...data.demandes.map((demande) => ({
          ...demande,
          libelleColoration: formatLibellesColoration(demande),
          ...demande.avis.reduce(
            (acc, current, index) => {
              acc[`avis${index}`] = [
                current.fonction!.toUpperCase(),
                `Avis ${current.statut}`,
                current.commentaire,
              ].join(" - ");
              return acc;
            },
            {} as Record<string, string>
          ),
        })),
      ],
      DEMANDES_COLUMNS
    );
  };

  const onExportExcel = async (isFiltered?: boolean) => {
    trackEvent("saisie_demandes:export-excel");
    const data = await client.ref("[GET]/demandes").query({
      query: isFiltered ? getDemandesQueryParameters() : {},
    });
    downloadExcel(
      formatExportFilename("recueil_demandes"),
      [
        ...data.demandes.map((demande) => ({
          ...demande,
          libelleColoration: formatLibellesColoration(demande),
          ...demande.avis.reduce(
            (acc, current, index) => {
              acc[`avis${index}`] = [
                current.fonction!.toUpperCase(),
                `Avis ${current.statut}`,
                current.commentaire,
              ].join(" - ");
              return acc;
            },
            {} as Record<string, string>
          ),
        })),
      ],
      DEMANDES_COLUMNS
    );
  };

  const [colonneFilters, setColonneFilters] = useState<Array<DEMANDES_COLUMNS_KEYS>>(
    (columns.length ? columns : Object.keys(DEMANDES_COLUMNS_DEFAULT)) as Array<DEMANDES_COLUMNS_KEYS>
  );

  const handleColonneFilters = (value: Array<DEMANDES_COLUMNS_KEYS>) => {
    setSearchParams({ columns: value });
    setColonneFilters(value);
  };

  if (!data) return <DemandeSpinner />;

  const isNouvelleDemandeDisabled = !canCreateDemande({
    user,
    campagne: data.campagne,
  });

  const canCheckDemandes = hasPermission(user?.role, PermissionEnum["demande-statut/ecriture"]);

  return (
    <Flex direction={"column"} flex={1} position="relative" minH="100%" minW={0} bgColor={"bluefrance.975"}>
      <FiltersSection
        user={user}
        isNouvelleDemandeDisabled={isNouvelleDemandeDisabled}
        activeFilters={filters}
        setSearchParams={setSearchParams}
        campagne={data?.campagne}
        filterTracker={filterTracker}
        academies={data?.filters.academies ?? []}
        departements={data?.filters.departements ?? []}
        communes={data?.filters.communes ?? []}
        etablissements={data?.filters.etablissements ?? []}
        campagnes={data?.filters.campagnes}
        handleFilters={handleFilters}
      />
      <Flex flex={1} direction="row" overflow="visible" minHeight={0} minW={0}>
        <SideSection
          isNouvelleDemandeDisabled={isNouvelleDemandeDisabled}
          isRecapView
          filterTracker={filterTracker}
          diplomes={data?.filters.diplomes ?? []}
          domaines={data?.filters.domaines ?? []}
          formations={data?.filters.formations ?? []}
          filieresCmq={data?.filters.filieresCmq ?? []}
          nomsCmq={data?.filters.nomsCmq ?? []}
          handleFilters={handleFilters}
          activeFilters={filters}
        />
        <Flex flex={1} direction="column" overflow="visible" minHeight={0} minW={0}>
          {(isLoading) ? (
            <DemandeSpinner />
          ) : (
            <>
              {isModifyingGroup ? (
                <DemandeSpinner mt={6}/>
              ) : <> {
                data?.demandes.length ? (
                  <>
                    <TableHeader
                      p={4}
                      pt={0}
                      bgColor={"white"}
                      SearchInput={
                        <ConsoleSearchInput
                          placeholder="Rechercher dans les résultats"
                          onChange={(newValue) => {
                            const oldValue = searchFormation;
                            setSearchFormation(newValue);
                            if (newValue.length > 2 || oldValue.length > newValue.length) {
                              onSearch(newValue);
                            }
                          }}
                          value={searchFormation}
                          onClick={onSearch}
                          width={{ base: "25rem", ["2xl"]: "35rem" }}
                        />
                      }
                      ColonneFilter={
                        <ColonneFilterSection
                          colonneFilters={colonneFilters}
                          handleColonneFilters={handleColonneFilters}
                          forcedColonnes={["libelleFormation"]}
                          trackEvent={trackEvent}
                        />
                      }
                      onExportCsv={onExportCsv}
                      onExportExcel={onExportExcel}
                      page={page}
                      pageSize={PAGE_SIZE}
                      count={data?.count}
                      onPageChange={(newPage) => setSearchParams({ ...searchParams, page: `${newPage}` })}
                    />
                    <ConsoleSection
                      user={user}
                      data={data}
                      handleOrder={handleOrder}
                      order={order}
                      isLoading={isLoading}
                      canCheckDemandes={canCheckDemandes}
                      setIsModifyingGroup={setIsModifyingGroup}
                      colonneFilters={colonneFilters}
                    />
                  </>
                ) : (
                  <Center mt={12}>
                    <Flex direction={"column"}>
                      <Text fontSize={"2xl"}>Pas de demande à afficher</Text>
                      <Tooltip
                        label={getMessageAccompagnementCampagne({
                          campagne: data?.campagne,
                          currentCampagne: currentCampagne!,
                          user
                        })}
                        shouldWrapChildren
                      >
                        <Flex>
                          <Button
                            isDisabled={isNouvelleDemandeDisabled}
                            variant="createButton"
                            size={"lg"}
                            as={!isNouvelleDemandeDisabled ? undefined : NextLink}
                            href={getRoutingAccessSaisieDemande({ user, suffix: `new?campagneId=${data?.campagne.id}`})}
                            px={3}
                            mt={12}
                            mx={"auto"}
                          >
                            Nouvelle demande
                          </Button>
                        </Flex>
                      </Tooltip>
                    </Flex>
                  </Center>
                )}
              </>
              }
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
