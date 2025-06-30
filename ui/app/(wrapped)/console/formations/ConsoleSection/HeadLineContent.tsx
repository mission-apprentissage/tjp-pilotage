import { Box, chakra,Th, Thead, Tooltip, Tr, VisuallyHidden } from "@chakra-ui/react";
import { usePlausible } from "next-plausible";
import type { CSSProperties } from "react";

import { TooltipDefinitionDomaineDeFormation } from "@/app/(wrapped)/components/definitions/DefinitionDomaineDeFormation";
import { TooltipDefinitionEffectifEnEntree } from "@/app/(wrapped)/components/definitions/DefinitionEffectifEnEntree";
import { TooltipDefinitionFormationSpecifique} from '@/app/(wrapped)/components/definitions/DefinitionFormationSpecifique';
import { TooltipDefinitionNombreEleves} from '@/app/(wrapped)/components/definitions/DefinitionNombreEleves';
import { TooltipDefinitionPositionQuadrant } from "@/app/(wrapped)/components/definitions/DefinitionPositionQuadrant";
import { TooltipDefinitionTauxDePression } from "@/app/(wrapped)/components/definitions/DefinitionTauxDePression";
import { TooltipDefinitionTauxDevenirFavorable } from "@/app/(wrapped)/components/definitions/DefinitionTauxDevenirFavorable";
import { TooltipDefinitionTauxEmploi6Mois } from "@/app/(wrapped)/components/definitions/DefinitionTauxEmploi6Mois";
import { TooltipDefinitionTauxPoursuiteEtudes } from "@/app/(wrapped)/components/definitions/DefinitionTauxPoursuiteEtudes";
import { TooltipDefinitionTauxRemplissage } from "@/app/(wrapped)/components/definitions/DefinitionTauxRemplissage";
import { FORMATION_COLUMNS } from "@/app/(wrapped)/console/formations/FORMATION_COLUMNS";
import type { Filters, Order } from "@/app/(wrapped)/console/formations/types";
import { OrderIcon } from "@/components/OrderIcon";

const ConditionalTh = chakra(
  ({
    className,
    children,
    style,
    colonneFilters,
    colonne,
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
    getCellBgColor: (column: keyof typeof FORMATION_COLUMNS) => string;
    onClick?: (column: Order["orderBy"]) => void;
    isNumeric?: boolean;
    icon?: React.ReactNode;
  }) => {
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
  isSticky,
  colonneFilters,
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
  isSticky?: boolean;
  colonneFilters: (keyof typeof FORMATION_COLUMNS)[];
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
    <Thead position="sticky" top="0" boxShadow="0 0 6px 0 rgb(0,0,0,0.15)" zIndex={2}>
      <Tr bg={"white"}>
        <Th>
          <VisuallyHidden>Historique</VisuallyHidden>
        </Th>
        <ConditionalTh colonne={"rentreeScolaire"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
          {FORMATION_COLUMNS.rentreeScolaire}
        </ConditionalTh>
        <ConditionalTh
          colonne={"libelleDispositif"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="libelleDispositif" />
          {FORMATION_COLUMNS.libelleDispositif}
        </ConditionalTh>
        <ConditionalTh
          colonne={"libelleFormation"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          cursor="pointer"
          onClick={handleOrder}
          minW={450}
          left={0}
          zIndex={1}
          position={{ lg: "relative", xl: "sticky" }}
          boxShadow={{
            lg: "none",
            xl: isSticky ? "inset -2px 0px 0px 0px #E2E8F0" : "none",
          }}
        >
          <OrderIcon {...order} column="libelleFormation" />
          {FORMATION_COLUMNS.libelleFormation}
        </ConditionalTh>
        <ConditionalTh
          colonne={"formationSpecifique"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          icon={<TooltipDefinitionFormationSpecifique />}
        >
          {FORMATION_COLUMNS.formationSpecifique}
        </ConditionalTh>
        <ConditionalTh
          colonne={"libelleNiveauDiplome"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="libelleNiveauDiplome" />
          {FORMATION_COLUMNS.libelleNiveauDiplome}
        </ConditionalTh>
        <ConditionalTh
          colonne={"libelleFamille"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="libelleFamille" />
          {FORMATION_COLUMNS.libelleFamille}
        </ConditionalTh>
        <ConditionalTh
          colonne={"cfd"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="cfd" />
          {FORMATION_COLUMNS.cfd}
        </ConditionalTh>
        <ConditionalTh
          colonne={"cpc"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="cpc" />
          {FORMATION_COLUMNS.cpc}
        </ConditionalTh>
        <ConditionalTh
          colonne={"cpcSecteur"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="cpcSecteur" />
          {FORMATION_COLUMNS.cpcSecteur}
        </ConditionalTh>
        <ConditionalTh
          colonne={"libelleNsf"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          cursor="pointer"
          onClick={handleOrder}
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
        >
          <OrderIcon {...order} column="nbEtablissement" />
          {FORMATION_COLUMNS.nbEtablissement}
        </ConditionalTh>
        <ConditionalTh
          colonne={"evolutionEffectif"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
        >
          {FORMATION_COLUMNS.evolutionEffectif}
        </ConditionalTh>
        <ConditionalTh
          colonne={"effectif1"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          isNumeric
          cursor="pointer"
          onClick={handleOrder}
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
          icon={<TooltipDefinitionNombreEleves />}
        >
          <OrderIcon {...order} column="effectif3" />
          {FORMATION_COLUMNS.effectif3}
        </ConditionalTh>
        <ConditionalTh
          colonne={"effectifEntree"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          cursor="pointer"
          onClick={handleOrder}
          icon={<TooltipDefinitionEffectifEnEntree />}
        >
          <OrderIcon {...order} column="effectifEntree" />
          {FORMATION_COLUMNS.effectifEntree}
        </ConditionalTh>
        <ConditionalTh
          colonne={"tauxPression"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          cursor="pointer"
          onClick={handleOrder}
          textAlign={"center"}
          icon={<TooltipDefinitionTauxDePression />}
        >
          <OrderIcon {...order} column="tauxPression" />
          {FORMATION_COLUMNS.tauxPression}
        </ConditionalTh>
        <ConditionalTh
          colonne={"evolutionTauxPression"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          maxWidth={48}
        >
          {FORMATION_COLUMNS.evolutionTauxPression}
        </ConditionalTh>
        <ConditionalTh
          colonne={"tauxRemplissage"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          cursor="pointer"
          onClick={handleOrder}
          textAlign={"center"}
          icon={<TooltipDefinitionTauxRemplissage />}
        >
          <OrderIcon {...order} column="tauxRemplissage" />
          {FORMATION_COLUMNS.tauxRemplissage}
        </ConditionalTh>
        <ConditionalTh
          colonne={"evolutionTauxRemplissage"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          maxWidth={48}
        >
          {FORMATION_COLUMNS.evolutionTauxRemplissage}
        </ConditionalTh>
        {canShowQuadrantPosition && (
          <ConditionalTh
            colonne={"positionQuadrant"}
            colonneFilters={colonneFilters}
            getCellBgColor={getCellBgColor}
            cursor="pointer"
            onClick={handleOrder}
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
          cursor="pointer"
          onClick={handleOrder}
          textAlign={"center"}
          icon={<TooltipDefinitionTauxEmploi6Mois />}
        >
          <OrderIcon {...order} column="tauxInsertion" />
          {FORMATION_COLUMNS.tauxInsertion}
        </ConditionalTh>
        <ConditionalTh
          colonne={"evolutionTauxInsertion"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          maxWidth={48}
        >
          {FORMATION_COLUMNS.evolutionTauxInsertion}
        </ConditionalTh>
        <ConditionalTh
          colonne={"tauxPoursuite"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          cursor="pointer"
          onClick={handleOrder}
          textAlign={"center"}
          icon={<TooltipDefinitionTauxPoursuiteEtudes />}
        >
          <OrderIcon {...order} column="tauxPoursuite" />
          {FORMATION_COLUMNS.tauxPoursuite}
        </ConditionalTh>
        <ConditionalTh
          colonne={"evolutionTauxPoursuite"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          maxWidth={48}
        >
          {FORMATION_COLUMNS.evolutionTauxPoursuite}
        </ConditionalTh>
        <ConditionalTh
          colonne={"tauxDevenirFavorable"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          cursor="pointer"
          onClick={handleOrder}
          textAlign={"center"}
          icon={<TooltipDefinitionTauxDevenirFavorable />}
        >
          <OrderIcon {...order} column="tauxDevenirFavorable" />
          {FORMATION_COLUMNS.tauxDevenirFavorable}
        </ConditionalTh>
        <ConditionalTh
          colonne={"evolutionTauxDevenirFavorable"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          maxWidth={48}
        >
          {FORMATION_COLUMNS.evolutionTauxDevenirFavorable}
        </ConditionalTh>
      </Tr>
    </Thead>
  );
};
