import { Box, Button, Checkbox, Divider, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

import type { EtablissementsFilters, EtablissementsOrderBy, EtablissementsView } from ".";

export const MapActions = ({
  nbEtablissementsInZone,
  etabFilters,
  handleIncludeAllChange,
  handleViewChange,
  handleOrderByChange,
}: {
  nbEtablissementsInZone: number;
  etabFilters: EtablissementsFilters;
  handleIncludeAllChange: (includeAll: boolean) => void;
  handleViewChange: (view: EtablissementsView) => void;
  handleOrderByChange: (orderBy: EtablissementsOrderBy) => void;
}) => {
  const { includeAll } = etabFilters;
  return (
    <Flex direction={"column"} gap={4}>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Flex>
          {etabFilters.view === "map" && (
            <Button
              variant="ghost"
              color={"bluefrance.113"}
              gap={2}
              alignItems={"center"}
              onClick={() => handleViewChange("list")}
            >
              <Icon icon="ri:list-check" />
              Vue liste
            </Button>
          )}
          {etabFilters.view === "list" && (
            <Button
              variant="ghost"
              color={"bluefrance.113"}
              gap={2}
              alignItems={"center"}
              onClick={() => handleViewChange("map")}
            >
              <Icon icon="ri:map-pin-line" />
              Vue carte
            </Button>
          )}
          {etabFilters.view === "map" && (
            <Button variant="ghost" color={"bluefrance.113"} gap={2} alignItems={"center"}>
              <Icon icon="ri:focus-3-line" />
              Recenter
            </Button>
          )}
          {etabFilters.view === "list" && (
            <Menu gutter={0}>
              <MenuButton
                as={Button}
                variant="ghost"
                color={"bluefrance.113"}
                gap={2}
                alignItems={"center"}
                leftIcon={<Icon icon="ri:sort-desc" />}
              >
                Trier
              </MenuButton>
              <MenuList>
                <MenuItem
                  color="bluefrance.113"
                  fontSize="14px"
                  fontWeight={500}
                  gap={2}
                  onClick={() => handleOrderByChange("departement_commune")}
                >
                  {etabFilters.orderBy == "departement_commune" ? (
                    <Icon icon="ri:check-line" color={"bluefrance.113"} />
                  ) : (
                    <Box w={"12px"} />
                  )}
                  Par département et commune
                </MenuItem>
                <MenuItem
                  color="bluefrance.113"
                  fontSize="14px"
                  fontWeight={500}
                  gap={2}
                  onClick={() => handleOrderByChange("libelle")}
                >
                  {etabFilters.orderBy == "libelle" ? (
                    <Icon icon="ri:check-line" color={"bluefrance.113"} />
                  ) : (
                    <Box w={"12px"} />
                  )}
                  Par nom d'établissement
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>

        <Text>
          <strong>{nbEtablissementsInZone}</strong> résultat(s) dans la zone affichée
        </Text>
      </Flex>

      <Divider />
      <Checkbox
        isChecked={Boolean(includeAll)}
        onChange={(e) => handleIncludeAllChange(e.target.checked)}
        variant="accessible"
        pl={"13px"}
      >
        inclure les établissements des territoires limitrophes
      </Checkbox>
      <Divider />
    </Flex>
  );
};
