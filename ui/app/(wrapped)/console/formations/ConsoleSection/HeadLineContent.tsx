import { Box, chakra, IconButton,Th, Thead, Tooltip, Tr, VisuallyHidden } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { usePlausible } from "next-plausible";
import type { CSSProperties } from "react";

import { TooltipDefinitionDomaineDeFormation } from "@/app/(wrapped)/components/definitions/DefinitionDomaineDeFormation";
import { TooltipDefinitionEffectifEnEntree } from "@/app/(wrapped)/components/definitions/DefinitionEffectifEnEntree";
import { TooltipDefinitionFormationSpecifique} from '@/app/(wrapped)/components/definitions/DefinitionFormationSpecifique';
import { TooltipDefinitionNombreEleves} from '@/app/(wrapped)/components/definitions/DefinitionNombreEleves';
import { TooltipDefinitionPositionQuadrant } from "@/app/(wrapped)/components/definitions/DefinitionPositionQuadrant";
import { TooltipDefinitionTauxDeDemande } from "@/app/(wrapped)/components/definitions/DefinitionTauxDeDemande";
import { TooltipDefinitionTauxDePression } from "@/app/(wrapped)/components/definitions/DefinitionTauxDePression";
import { TooltipDefinitionTauxDevenirFavorable } from "@/app/(wrapped)/components/definitions/DefinitionTauxDevenirFavorable";
import { TooltipDefinitionTauxEmploi6Mois } from "@/app/(wrapped)/components/definitions/DefinitionTauxEmploi6Mois";
import { TooltipDefinitionTauxPoursuiteEtudes } from "@/app/(wrapped)/components/definitions/DefinitionTauxPoursuiteEtudes";
import { TooltipDefinitionTauxRemplissage } from "@/app/(wrapped)/components/definitions/DefinitionTauxRemplissage";
import { FORMATION_COLUMNS } from "@/app/(wrapped)/console/formations/FORMATION_COLUMNS";
import type { Filters, FORMATION_COLUMNS_KEYS, Order } from "@/app/(wrapped)/console/formations/types";
import { OrderIcon } from "@/components/OrderIcon";

import { CHEVRON_COLUMN_WIDTH, COLUMNS_WIDTH } from "./COLUMNS_WIDTH";
import { getLeftOffset, isColonneSticky } from "./utils";

const ConditionalTh = chakra(
  ({
    className,
    children,
    style,
    colonneFilters,
    colonne,
    stickyColonnes,
    setStickyColonnes,
    getCellBgColor,
    onClick,
    isNumeric = false,
    icon
  }: {
    className?: string;
    style?: CSSProperties;
    children: React.ReactNode;
    colonneFilters: (keyof typeof FORMATION_COLUMNS)[];
    colonne: keyof typeof FORMATION_COLUMNS;
    stickyColonnes: FORMATION_COLUMNS_KEYS[];
    setStickyColonnes: React.Dispatch<React.SetStateAction<FORMATION_COLUMNS_KEYS[]>>;
    getCellBgColor: (column: keyof typeof FORMATION_COLUMNS) => string;
    onClick?: (column: Order["orderBy"]) => void;
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
          cursor={onClick ? "pointer" : "default"}
          onClick={() => onClick && onClick(colonne as Order["orderBy"])}
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
        >
          <Box maxW={280} sx={{
            display: "flex",
            alignItems: "center",
          }}>
            <Tooltip label={FORMATION_COLUMNS[colonne]} placement="top">
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
                {children}
              </Box>
            </Tooltip>
            {icon}
            <Tooltip label={`${isSticky ? "Libérer" : "Figer"} la colonne ${FORMATION_COLUMNS[colonne].toLocaleLowerCase()}`} placement="top">
              <IconButton
                aria-label={`Figer la colonne ${FORMATION_COLUMNS[colonne].toLocaleLowerCase()}`}
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
                      return prev.filter((c) => c !== colonne) as FORMATION_COLUMNS_KEYS[];
                    }
                    return ([...prev, colonne] as FORMATION_COLUMNS_KEYS[]).sort((a, b) =>
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
  order,
  setSearchParams,
  canShowQuadrantPosition,
  colonneFilters,
  stickyColonnes,
  setStickyColonnes,
  getCellBgColor,
}: {
  order: Partial<Order>;
  setSearchParams: (params: {
    filters?: Partial<Filters>;
    search?: string;
    order?: Partial<Order>;
    page?: number;
  }) => void;
  canShowQuadrantPosition?: boolean;
  colonneFilters: (keyof typeof FORMATION_COLUMNS)[];
  stickyColonnes: FORMATION_COLUMNS_KEYS[];
  setStickyColonnes: React.Dispatch<React.SetStateAction<FORMATION_COLUMNS_KEYS[]>>;
  getCellBgColor: (column: keyof typeof FORMATION_COLUMNS) => string;
}) => {
  const trackEvent = usePlausible();

  const handleOrder = (column: Order["orderBy"]) => {
    trackEvent("formations:ordre", { props: { colonne: column } });
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

  return (
    <Thead
      position="sticky"
      top="0"
      boxShadow={{
        lg: "none",
        xl: "inset -1px 0px 0px 0px #f6f6f6",
      }}
      zIndex={2}
    >
      <Tr bg={"white"}>
        <Th
          boxShadow={{
            lg: "none",
            xl: "inset -1px 0px 0px 0px #f6f6f6",
          }}
          position={{
            lg: "static",
            xl: "sticky",
          }}
          left={0}
          maxW={CHEVRON_COLUMN_WIDTH}
          minW={CHEVRON_COLUMN_WIDTH}
          w={CHEVRON_COLUMN_WIDTH}
          zIndex={2}
          bgColor={"white"}
        >
          <VisuallyHidden>Historique</VisuallyHidden>
        </Th>
        <ConditionalTh
          colonne={"rentreeScolaire"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          {FORMATION_COLUMNS.rentreeScolaire}
        </ConditionalTh>
        <ConditionalTh
          colonne={"libelleDispositif"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          <OrderIcon {...order} column="libelleDispositif" />
          {FORMATION_COLUMNS.libelleDispositif}
        </ConditionalTh>
        <ConditionalTh
          colonne={"libelleFormation"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          <OrderIcon {...order} column="libelleFormation" />
          {FORMATION_COLUMNS.libelleFormation}
        </ConditionalTh>
        <ConditionalTh
          colonne={"formationSpecifique"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionFormationSpecifique />}
        >
          {FORMATION_COLUMNS.formationSpecifique}
        </ConditionalTh>
        <ConditionalTh
          colonne={"libelleNiveauDiplome"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          <OrderIcon {...order} column="libelleNiveauDiplome" />
          {FORMATION_COLUMNS.libelleNiveauDiplome}
        </ConditionalTh>
        <ConditionalTh
          colonne={"libelleFamille"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          <OrderIcon {...order} column="libelleFamille" />
          {FORMATION_COLUMNS.libelleFamille}
        </ConditionalTh>
        <ConditionalTh
          colonne={"cfd"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          <OrderIcon {...order} column="cfd" />
          {FORMATION_COLUMNS.cfd}
        </ConditionalTh>
        <ConditionalTh
          colonne={"cpc"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          <OrderIcon {...order} column="cpc" />
          {FORMATION_COLUMNS.cpc}
        </ConditionalTh>
        <ConditionalTh
          colonne={"cpcSecteur"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          <OrderIcon {...order} column="cpcSecteur" />
          {FORMATION_COLUMNS.cpcSecteur}
        </ConditionalTh>
        <ConditionalTh
          colonne={"libelleNsf"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionDomaineDeFormation />}
        >
          <OrderIcon {...order} column="libelleNsf" />
          {FORMATION_COLUMNS.libelleNsf}
        </ConditionalTh>
        <ConditionalTh
          colonne={"nbEtablissement"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          isNumeric
          cursor="pointer"
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          <OrderIcon {...order} column="nbEtablissement" />
          {FORMATION_COLUMNS.nbEtablissement}
        </ConditionalTh>
        <ConditionalTh
          colonne={"effectif1"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          isNumeric
          cursor="pointer"
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionNombreEleves />}
        >
          <OrderIcon {...order} column="effectif1" />
          {FORMATION_COLUMNS.effectif1}
        </ConditionalTh>
        <ConditionalTh
          colonne={"effectif2"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          isNumeric
          cursor="pointer"
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionNombreEleves />}
        >
          <OrderIcon {...order} column="effectif2" />
          {FORMATION_COLUMNS.effectif2}
        </ConditionalTh>
        <ConditionalTh
          colonne={"effectif3"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          isNumeric
          cursor="pointer"
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionNombreEleves />}
        >
          <OrderIcon {...order} column="effectif3" />
          {FORMATION_COLUMNS.effectif3}
        </ConditionalTh>
        <ConditionalTh
          colonne={"effectifEntree"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionEffectifEnEntree />}
        >
          <OrderIcon {...order} column="effectifEntree" />
          {FORMATION_COLUMNS.effectifEntree}
        </ConditionalTh>
        <ConditionalTh
          colonne={"tauxPression"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          textAlign={"center"}
          icon={<TooltipDefinitionTauxDePression />}
        >
          <OrderIcon {...order} column="tauxPression" />
          {FORMATION_COLUMNS.tauxPression}
        </ConditionalTh>
        <ConditionalTh
          colonne={"tauxDemande"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          textAlign={"center"}
          icon={<TooltipDefinitionTauxDeDemande />}
        >
          <OrderIcon {...order} column="tauxDemande" />
          {FORMATION_COLUMNS.tauxDemande}
        </ConditionalTh>
        <ConditionalTh
          colonne={"tauxRemplissage"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          textAlign={"center"}
          icon={<TooltipDefinitionTauxRemplissage />}
        >
          <OrderIcon {...order} column="tauxRemplissage" />
          {FORMATION_COLUMNS.tauxRemplissage}
        </ConditionalTh>
        {canShowQuadrantPosition && (
          <ConditionalTh
            colonne={"positionQuadrant"}
            colonneFilters={colonneFilters}
            getCellBgColor={getCellBgColor}
            cursor="pointer"
            onClick={handleOrder}
            stickyColonnes={stickyColonnes}
            setStickyColonnes={setStickyColonnes}
            icon={<TooltipDefinitionPositionQuadrant />}
          >
            <OrderIcon {...order} column="positionQuadrant" />
            {FORMATION_COLUMNS.positionQuadrant}
          </ConditionalTh>
        )}
        <ConditionalTh
          colonne={"tauxInsertion"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          textAlign={"center"}
          icon={<TooltipDefinitionTauxEmploi6Mois />}
        >
          <OrderIcon {...order} column="tauxInsertion" />
          {FORMATION_COLUMNS.tauxInsertion}
        </ConditionalTh>
        <ConditionalTh
          colonne={"tauxPoursuite"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          textAlign={"center"}
          icon={<TooltipDefinitionTauxPoursuiteEtudes />}
        >
          <OrderIcon {...order} column="tauxPoursuite" />
          {FORMATION_COLUMNS.tauxPoursuite}
        </ConditionalTh>
        <ConditionalTh
          colonne={"tauxDevenirFavorable"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          textAlign={"center"}
          icon={<TooltipDefinitionTauxDevenirFavorable />}
        >
          <OrderIcon {...order} column="tauxDevenirFavorable" />
          {FORMATION_COLUMNS.tauxDevenirFavorable}
        </ConditionalTh>
      </Tr>
    </Thead>
  );
};
