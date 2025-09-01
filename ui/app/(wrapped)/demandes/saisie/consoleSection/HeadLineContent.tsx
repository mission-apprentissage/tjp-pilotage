import { Box, chakra, Checkbox, IconButton, Th, Thead, Tooltip,Tr } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import type { CSSProperties } from "react";

import { COLUMNS_WIDTH } from "@/app/(wrapped)/console/formations/ConsoleSection/COLUMNS_WIDTH";
import { DEMANDES_COLUMNS_OPTIONAL } from "@/app/(wrapped)/demandes/saisie/DEMANDES_COLUMNS";
import type { CheckedDemandesType } from "@/app/(wrapped)/demandes/saisie/page.client";
import type { DEMANDES_COLUMNS_KEYS,Order  } from "@/app/(wrapped)/demandes/saisie/types";
import { OrderIcon } from "@/components/OrderIcon";

import { getLeftOffset, isColonneSticky } from "./utils";

const ConditionalTh = chakra(
  ({
    className,
    style,
    colonneFilters,
    colonne,
    stickyColonnes,
    setStickyColonnes,
    getCellBgColor,
    order,
    handleOrder,
    isNumeric = false,
    icon
  }: {
    className?: string;
    style?: CSSProperties;
    colonneFilters: Array<DEMANDES_COLUMNS_KEYS>;
    colonne: DEMANDES_COLUMNS_KEYS;
    stickyColonnes: DEMANDES_COLUMNS_KEYS[];
    setStickyColonnes: React.Dispatch<React.SetStateAction<DEMANDES_COLUMNS_KEYS[]>>;
    getCellBgColor: (column: DEMANDES_COLUMNS_KEYS) => string;
    order: Partial<Order>;
    handleOrder?: (column: Order["orderBy"]) => void;
    isNumeric?: boolean;
    icon?: React.ReactNode;
  }) => {
    const isSticky = isColonneSticky({ colonne, stickyColonnes });

    if (colonneFilters.includes(colonne))
      return (
        <Th
          p={2}
          className={className}
          style={style}
          isNumeric={isNumeric}
          cursor={handleOrder ? "pointer" : "default"}
          onClick={() => handleOrder && handleOrder(colonne as Order["orderBy"])}
          bgColor={getCellBgColor(colonne)}
          w={COLUMNS_WIDTH[colonne as keyof typeof COLUMNS_WIDTH]}
          minW={COLUMNS_WIDTH[colonne as keyof typeof COLUMNS_WIDTH]}
          maxW={COLUMNS_WIDTH[colonne as keyof typeof COLUMNS_WIDTH]}
          left={getLeftOffset({ colonne, stickyColonnes, colonneFilters })}
          zIndex={isSticky ? 2 : undefined}
          boxShadow={{
            lg: "none",
            xl: "inset -1px 0px 0px 0px #f6f6f6",
          }}
          position={{
            lg: "static",
            xl: isSticky ? "sticky" : "static",
          }}
          fontSize={12}
        >
          <Box maxW={280} sx={{
            display: "flex",
            alignItems: "center",
          }}>
            <Tooltip label={DEMANDES_COLUMNS_OPTIONAL[colonne]} placement="top">
              <Box
                fontSize={12}
                fontWeight={700}
                lineHeight={"20px"}
                textTransform={"uppercase"}
                textOverflow={"ellipsis"}
                alignSelf={"stretch"}
                isTruncated
                whiteSpace="nowrap"
              >
                <OrderIcon {...order} column={colonne} />
                {DEMANDES_COLUMNS_OPTIONAL[colonne]}
              </Box>
            </Tooltip>
            {icon}
            <Tooltip label={`${isSticky ? "Libérer" : "Figer"} la colonne ${DEMANDES_COLUMNS_OPTIONAL[colonne].toLocaleLowerCase()}`} placement="top">
              <IconButton
                aria-label={`Figer la colonne ${DEMANDES_COLUMNS_OPTIONAL[colonne].toLocaleLowerCase()}`}
                icon={
                  isSticky ?
                    <Icon icon={"ri:lock-line"} /> :
                    <Icon icon={"ri:lock-unlock-line"} />
                }
                ms={"auto"}
                size="xs"
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setStickyColonnes((prev) => {
                    if (prev.includes(colonne)) {
                      return prev.filter((c) => c !== colonne) as DEMANDES_COLUMNS_KEYS[];
                    }
                    return ([...prev, colonne] as DEMANDES_COLUMNS_KEYS[]).sort((a, b) =>
                      (
                        Object.keys(COLUMNS_WIDTH).indexOf(a) -
                        Object.keys(COLUMNS_WIDTH).indexOf(b)
                      )
                    );
                  });
                }}
              />
            </Tooltip>
          </Box>
        </Th>
      );
    return null;
  }
);

export const HeadLineContent = ({
  handleOrder,
  order,
  canCheckDemandes,
  checkedDemandes,
  setCheckedDemandes,
  colonneFilters,
  stickyColonnes,
  setStickyColonnes,
  getCellBgColor
} : {
  handleOrder: (column: Order["orderBy"]) => void;
  order: Partial<Order>;
  canCheckDemandes: boolean;
  checkedDemandes: CheckedDemandesType | undefined;
  setCheckedDemandes: (value: CheckedDemandesType | undefined) => void;
  colonneFilters: (keyof typeof DEMANDES_COLUMNS_OPTIONAL)[];
  stickyColonnes: DEMANDES_COLUMNS_KEYS[];
  setStickyColonnes: React.Dispatch<React.SetStateAction<DEMANDES_COLUMNS_KEYS[]>>;
  getCellBgColor: (column: keyof typeof DEMANDES_COLUMNS_OPTIONAL) => string;
}) => {

  return (
    <Thead position="sticky" top="0" borderBottom={"2px solid"} borderColor={"grey.925"} bg="white" zIndex={"1"}>
      <Tr bg={"white"}>
        {canCheckDemandes && (
          <Th textAlign={"center"}>
            {checkedDemandes?.demandes.length &&
              (
                <Checkbox
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCheckedDemandes(undefined);
                  }}
                  borderRadius={4}
                  borderColor={"bluefrance.113"}
                  bgColor={"white"}
                  _checked={{
                    bgColor: "bluefrance.113",
                  }}
                  colorScheme="bluefrance"
                  iconColor={"white"}
                  isChecked={true}
                />
              )
            }
          </Th>
        )}
        <ConditionalTh
          colonne={"updatedAt"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne={"libelleFormation"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne={"libelleEtablissement"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne={"libelleDepartement"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne={"statut"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne={"numero"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne={"typeDemande"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne={"createdAt"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne={"numero"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne={"userName"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne={"typeDemande"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne={"progression"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne={"avisPhaseEnCours"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne={"derniersAvisPhaseEnCours"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
      </Tr>
    </Thead>
  );
};
