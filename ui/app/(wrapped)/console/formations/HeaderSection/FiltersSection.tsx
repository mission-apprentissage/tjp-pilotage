import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Select,
  Tag,
  Text,
  useDisclosure,
  Wrap,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { PositionQuadrantEnum } from "shared/enum/positionQuadrantEnum";

import { DeleteRequeteEnregistreeButton } from "../../components/DeleteRequeteEnregistreeButton";
import { CreateRequeteEnregistreeModal } from "../../components/CreateRequeteEnregistreeModal";
import { FilterTags } from "../../components/FilterTags";
import type { FORMATION_COLUMNS } from "../FORMATION_COLUMNS";
import type { Filters, FiltersList, Formations, Order, RequetesEnregistrees } from "../types";
import { Multiselect } from "@/components/Multiselect";
import { feature } from "@/utils/feature";

const REQUETES_ENREGISTREES = [
  {
    filtres: {},
    nom: "Transition écologique",
    couleur: "green.submitted",
  },
  {
    filtres: {
      positionQuadrant: [PositionQuadrantEnum["Q4"]],
    },
    nom: "Action prioritaire",
    couleur: "redmarianne.625_hover",
  },
];

export const FiltersSection = ({
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
  setRequeteEnregistreeActuelle: (requeteEnregistreeActuelle: { nom: string; couleur?: string }) => void;
}) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const resetFilters = () => {
    setSearchParams({
      filters: {
        ...searchParams.filters,
        codeRegion: [],
        codeAcademie: [],
        codeDepartement: [],
        commune: [],
        codeNiveauDiplome: [],
        codeDispositif: [],
        cfdFamille: [],
        cfd: [],
        codeNsf: [],
        positionQuadrant: [],
      },
      search: "",
    });
    setRequeteEnregistreeActuelle({ nom: "Requêtes favorites" });
  };

  const [deleteButtonToDisplay, setDeleteButtonToDisplay] = useState<string>("");

  const hasRequetesEnregistrees = requetesEnregistrees && requetesEnregistrees.length > 0;

  return (
    <Flex direction={"column"} gap={4} wrap={"wrap"}>
      <Wrap spacing={3}>
        <Menu autoSelect={false} gutter={3}>
          <MenuButton
            as={Button}
            variant={"selectButton"}
            rightIcon={<ChevronDownIcon />}
            width={"15rem"}
            size="md"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="grey.900"
            bg={"white"}
            opacity={hasRequetesEnregistrees ? 1 : 0.5}
            cursor={hasRequetesEnregistrees ? "pointer" : "not-allowed"}
            onClick={(e) => {
              if (!hasRequetesEnregistrees) {
                onOpen();
                e.preventDefault();
              }
            }}
          >
            <Flex direction="row" gap={2} overflow={"hidden"} whiteSpace="nowrap">
              {requeteEnregistreeActuelle.couleur && (
                <Tag size={"sm"} bgColor={requeteEnregistreeActuelle.couleur} borderRadius={"100%"} />
              )}
              <Text my={"auto"}>{requeteEnregistreeActuelle.nom}</Text>
            </Flex>
          </MenuButton>
          <Portal>
            <MenuList py={0} borderColor="grey.900" borderTopRadius={0} minW={"fit-content"} zIndex={3}>
              {requetesEnregistrees && requetesEnregistrees.length > 0 && (
                <>
                  <Text p={2} color="grey.425">
                    Vos requêtes favorites
                  </Text>
                  {/* @ts-expect-error TODO */}
                  {requetesEnregistrees?.map((requete) => (
                    <MenuItem
                      p={2}
                      key={requete.id}
                      onClick={() => {
                        setSearchParams({
                          page: 0,
                          filters: requete.filtres,
                        });
                        setRequeteEnregistreeActuelle(requete);
                      }}
                      onMouseEnter={() => setDeleteButtonToDisplay(requete.id)}
                      onMouseLeave={() => setDeleteButtonToDisplay("")}
                      gap={2}
                    >
                      <Tag size={"sm"} bgColor={requete.couleur} borderRadius={"100%"} />
                      <Flex direction="row" whiteSpace={"nowrap"}>
                        {requete.nom}
                      </Flex>
                      {deleteButtonToDisplay === requete.id && (
                        <DeleteRequeteEnregistreeButton requeteEnregistree={requete} />
                      )}
                    </MenuItem>
                  ))}
                  <Divider />
                </>
              )}
              {feature.requetesSuggerees && (
                <>
                  <Text p={2} color="grey.425">
                    Requêtes suggérées
                  </Text>
                  {REQUETES_ENREGISTREES.map((requeteEnregistree) => (
                    <MenuItem
                      p={2}
                      key={requeteEnregistree.nom}
                      onClick={() => {
                        setSearchParams({
                          page: 0,
                          filters: requeteEnregistree.filtres,
                        });
                        setRequeteEnregistreeActuelle(requeteEnregistree);
                      }}
                      gap={2}
                    >
                      <Tag size={"sm"} bgColor={requeteEnregistree.couleur} borderRadius={"100%"} />
                      <Flex direction="row">{requeteEnregistree.nom}</Flex>
                    </MenuItem>
                  ))}
                </>
              )}
            </MenuList>
          </Portal>
        </Menu>
        <Select
          placeholder="Toutes les régions"
          size="md"
          variant="newInput"
          width="14rem"
          onChange={(e) => {
            handleFilters("codeRegion", [e.target.value]);
          }}
          value={searchParams.filters?.codeRegion?.[0] ?? ""}
        >
          {/* @ts-expect-error TODO */}
          {filtersList?.regions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
        <Multiselect
          display={["none", null, "flex"]}
          disabled={!searchParams.filters?.codeRegion}
          size="md"
          variant="newInput"
          width="14rem"
          onChange={(selected) => handleFilters("codeAcademie", selected)}
          options={filtersList?.academies}
          value={searchParams.filters?.codeAcademie ?? []}
        >
          Académie
        </Multiselect>
        <Multiselect
          disabled={!searchParams.filters?.codeRegion}
          size="md"
          variant="newInput"
          width="14rem"
          onChange={(selected) => handleFilters("codeDepartement", selected)}
          options={filtersList?.departements}
          value={searchParams.filters?.codeDepartement ?? []}
        >
          Département
        </Multiselect>
        <Multiselect
          disabled={!searchParams.filters?.codeRegion}
          size="md"
          variant="newInput"
          width="14rem"
          onChange={(selected) => handleFilters("commune", selected)}
          options={filtersList?.communes}
          value={searchParams.filters?.commune ?? []}
        >
          Commune
        </Multiselect>
        <Button
          variant="externalLink"
          border={"none"}
          leftIcon={<Icon icon={"ri:refresh-line"} />}
          mt={"auto"}
          onClick={() => resetFilters()}
        >
          Réinitialiser les filtres
        </Button>
      </Wrap>
      <FilterTags
        handleFilters={handleFilters}
        filters={searchParams?.filters}
        filtersList={filtersList}
        isEditable={true}
      />
      {isOpen && (
        <CreateRequeteEnregistreeModal
          page={"formation"}
          isOpen={isOpen}
          onClose={onClose}
          searchParams={searchParams}
          filtersList={filtersList}
          altText={
            <>
              <Text>Vous n'avez pas encore de requête favorite enregistrée.</Text>
              <Text fontWeight={400} color="grey.450" fontSize={15}>
                En enregistrer une vous permettra de retrouver rapidement vos recherches.
              </Text>
            </>
          }
        />
      )}
    </Flex>
  );
};
