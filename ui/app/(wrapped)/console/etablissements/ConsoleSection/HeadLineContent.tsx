import { Box, chakra, Th, Thead, Tooltip, Tr, VisuallyHidden } from "@chakra-ui/react";
import { usePlausible } from "next-plausible";
import type { CSSProperties } from "react";
import { CURRENT_IJ_MILLESIME } from "shared";
import type { UserType } from "shared/schema/userSchema";
import { getMillesimeFromRentreeScolaire } from "shared/utils/getMillesime";

import { TooltipDefinitionDomaineDeFormation } from "@/app/(wrapped)/components/definitions/DefinitionDomaineDeFormation";
import { TooltipDefinitionEffectifEnEntree } from "@/app/(wrapped)/components/definitions/DefinitionEffectifEnEntree";
import { TooltipDefinitionFormationSpecifique } from "@/app/(wrapped)/components/definitions/DefinitionFormationSpecifique";
import { TooltipDefinitionNombreEleves } from "@/app/(wrapped)/components/definitions/DefinitionNombreEleves";
import { TooltipDefinitionPositionQuadrant } from "@/app/(wrapped)/components/definitions/DefinitionPositionQuadrant";
import { TooltipDefinitionTauxDeDemande } from "@/app/(wrapped)/components/definitions/DefinitionTauxDeDemande";
import { TooltipDefinitionTauxDePression } from "@/app/(wrapped)/components/definitions/DefinitionTauxDePression";
import { TooltipDefinitionTauxDevenirFavorable } from "@/app/(wrapped)/components/definitions/DefinitionTauxDevenirFavorable";
import { TooltipDefinitionTauxEmploi6Mois } from "@/app/(wrapped)/components/definitions/DefinitionTauxEmploi6Mois";
import { TooltipDefinitionTauxPoursuiteEtudes } from "@/app/(wrapped)/components/definitions/DefinitionTauxPoursuiteEtudes";
import { TooltipDefinitionTauxRemplissage } from "@/app/(wrapped)/components/definitions/DefinitionTauxRemplissage";
import { TooltipDefinitionValeurAjoutee } from "@/app/(wrapped)/components/definitions/DefinitionValeurAjoutee";
import { ETABLISSEMENT_COLUMN_WIDTH } from "@/app/(wrapped)/console/etablissements/ETABLISSEMENT_COLUMN_WIDTH";
import { FORMATION_ETABLISSEMENT_COLUMNS, FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED } from "@/app/(wrapped)/console/etablissements/FORMATION_ETABLISSEMENT_COLUMNS";
import type {Filters, FORMATION_ETABLISSEMENT_COLUMNS_KEYS,Order} from "@/app/(wrapped)/console/etablissements/types";
import { OrderIcon } from "@/components/OrderIcon";
import { feature } from "@/utils/feature";

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
    colonneFilters: FORMATION_ETABLISSEMENT_COLUMNS_KEYS[];
    colonne: FORMATION_ETABLISSEMENT_COLUMNS_KEYS;
    getCellBgColor: (column: FORMATION_ETABLISSEMENT_COLUMNS_KEYS) => string;
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
            <Tooltip label={FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED[colonne]} placement="top">
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
  isFirstColumnSticky,
  isSecondColumnSticky,
  colonneFilters,
  getCellBgColor,
  user,
  filters
}: {
  order: Partial<Order>;
  setSearchParams: (params: {
    filters?: Partial<Filters>;
    search?: string;
    order?: Partial<Order>;
    page?: number;
  }) => void;
  isFirstColumnSticky?: boolean;
  isSecondColumnSticky?: boolean;
  colonneFilters: (FORMATION_ETABLISSEMENT_COLUMNS_KEYS)[];
  getCellBgColor: (column: FORMATION_ETABLISSEMENT_COLUMNS_KEYS) => string;
  user?: UserType;
  filters?: Partial<Filters>;
}) => {
  const trackEvent = usePlausible();

  const handleOrder = (column: Order["orderBy"]) => {
    trackEvent("etablissements:ordre", { props: { colonne: column } });
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
    <Thead position="sticky" top="0" boxShadow="0 0 6px 0 rgb(0,0,0,0.15)" zIndex={"docked"}>
      <Tr bg={"white"}>
        <Th>
          <VisuallyHidden>Historique</VisuallyHidden>
        </Th>
        <ConditionalTh colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} colonne="rentreeScolaire">
          {FORMATION_ETABLISSEMENT_COLUMNS.rentreeScolaire}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="libelleEtablissement"
          cursor="pointer"
          onClick={handleOrder}
          minW={ETABLISSEMENT_COLUMN_WIDTH}
          maxW={ETABLISSEMENT_COLUMN_WIDTH}
          left={0}
          zIndex={1}
          position={{ lg: "relative", xl: "sticky" }}
          boxShadow={{
            lg: "none",
            xl: isFirstColumnSticky ? "inset -2px 0px 0px 0px #E2E8F0" : "none",
          }}
        >
          <OrderIcon {...order} column="libelleEtablissement" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleEtablissement}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="commune"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="commune" />
          {FORMATION_ETABLISSEMENT_COLUMNS.commune}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="libelleDepartement"
          cursor="pointer"
        >
          <OrderIcon {...order} column="libelleDepartement" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleDepartement}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="libelleAcademie"
          cursor="pointer"
        >
          <OrderIcon {...order} column="libelleAcademie" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleAcademie}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="libelleRegion"
          cursor="pointer"
        >
          <OrderIcon {...order} column="libelleRegion" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleRegion}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="secteur"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="secteur" />
          {FORMATION_ETABLISSEMENT_COLUMNS.secteur}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="uai"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="uai" />
          {FORMATION_ETABLISSEMENT_COLUMNS.uai}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="libelleDispositif"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="libelleDispositif" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleDispositif}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="libelleFormation"
          cursor="pointer"
          onClick={handleOrder}
          minW={450}
          zIndex={1}
          position={{ lg: "relative", xl: "sticky" }}
          left={{ lg: "unset", xl: 300 - 1 }}
          boxShadow={{
            lg: "none",
            xl: isSecondColumnSticky ? "inset -2px 0px 0px 0px #E2E8F0" : "none",
          }}
        >
          <OrderIcon {...order} column="libelleFormation" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleFormation}
        </ConditionalTh>
        <ConditionalTh
          colonne={"formationSpecifique"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          icon={<TooltipDefinitionFormationSpecifique /> }
        >
          {FORMATION_ETABLISSEMENT_COLUMNS.formationSpecifique}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="libelleNiveauDiplome"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="libelleNiveauDiplome" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleNiveauDiplome}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="libelleFamille"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="libelleFamille" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleFamille}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="cfd"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="cfd" />
          {FORMATION_ETABLISSEMENT_COLUMNS.cfd}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="cpc"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="cpc" />
          {FORMATION_ETABLISSEMENT_COLUMNS.cpc}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="cpcSecteur"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="cpcSecteur" />
          {FORMATION_ETABLISSEMENT_COLUMNS.cpcSecteur}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="libelleNsf"
          cursor="pointer"
          onClick={handleOrder}
          icon={<TooltipDefinitionDomaineDeFormation />}
        >
          <OrderIcon {...order} column="libelleNsf" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleNsf}
        </ConditionalTh>{feature.donneesTransfoConsole && user && (
          <>
            <ConditionalTh
              colonneFilters={colonneFilters}
              getCellBgColor={getCellBgColor}
              colonne="numero"
              cursor="pointer"
              onClick={handleOrder}
            >
              <OrderIcon {...order} column="numero" />
              {FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED.numero}
            </ConditionalTh>
            <ConditionalTh
              colonneFilters={colonneFilters}
              getCellBgColor={getCellBgColor}
              colonne="dateEffetTransformation"
              cursor="pointer"
              onClick={handleOrder}
              maxW={64}
            >
              <OrderIcon {...order} column="dateEffetTransformation" />
              {FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED.dateEffetTransformation}
            </ConditionalTh>
            <ConditionalTh
              colonneFilters={colonneFilters}
              getCellBgColor={getCellBgColor}
              colonne="typeDemande"
              cursor="pointer"
              onClick={handleOrder}
            >
              <OrderIcon {...order} column="typeDemande" />
              {FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED.typeDemande}
            </ConditionalTh>
            <ConditionalTh
              colonneFilters={colonneFilters}
              getCellBgColor={getCellBgColor}
              colonne="previsionnel"
            >
              {FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED.previsionnel}
            </ConditionalTh>
          </>
        )}
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="effectif1"
          isNumeric
          cursor="pointer"
          onClick={handleOrder}
          icon={<TooltipDefinitionNombreEleves /> }
        >
          <OrderIcon {...order} column="effectif1" />
          {FORMATION_ETABLISSEMENT_COLUMNS.effectif1}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="effectif2"
          isNumeric
          cursor="pointer"
          onClick={handleOrder}
          icon={<TooltipDefinitionNombreEleves /> }
        >
          <OrderIcon {...order} column="effectif2" />
          {FORMATION_ETABLISSEMENT_COLUMNS.effectif2}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="effectif3"
          isNumeric
          cursor="pointer"
          onClick={handleOrder}
          icon={<TooltipDefinitionNombreEleves /> }
        >
          <OrderIcon {...order} column="effectif3" />
          {FORMATION_ETABLISSEMENT_COLUMNS.effectif3}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="effectifEntree"
          cursor="pointer"
          onClick={handleOrder}
          width={"fit-content"}
          icon={<TooltipDefinitionEffectifEnEntree /> }
        >
          <OrderIcon {...order} column="effectifEntree" />
          {FORMATION_ETABLISSEMENT_COLUMNS.effectifEntree}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="capacite"
          isNumeric
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="capacite" />
          {FORMATION_ETABLISSEMENT_COLUMNS.capacite}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="tauxPression"
          cursor="pointer"
          onClick={handleOrder}
          icon={<TooltipDefinitionTauxDePression rentreeScolaire={filters?.rentreeScolaire?.[0]} />}
        >
          <OrderIcon {...order} column="tauxPression" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxPression}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="tauxDemande"
          cursor="pointer"
          onClick={handleOrder}
          icon={<TooltipDefinitionTauxDeDemande rentreeScolaire={filters?.rentreeScolaire?.[0]} /> }
        >
          <OrderIcon {...order} column="tauxDemande" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxDemande}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="tauxRemplissage"
          cursor="pointer"
          onClick={handleOrder}
          icon={<TooltipDefinitionTauxRemplissage rentreeScolaire={filters?.rentreeScolaire?.[0]} /> }
        >
          <OrderIcon {...order} column="tauxRemplissage" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxRemplissage}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="positionQuadrant"
          cursor="pointer"
          onClick={handleOrder}
          icon={
            <TooltipDefinitionPositionQuadrant
              millesime={
                filters?.rentreeScolaire ?
                  getMillesimeFromRentreeScolaire({rentreeScolaire: filters?.rentreeScolaire[0], offset: 0}) :
                  CURRENT_IJ_MILLESIME
              }
            />
          }
        >
          <OrderIcon {...order} column="positionQuadrant" />
          {FORMATION_ETABLISSEMENT_COLUMNS.positionQuadrant}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="tauxDevenirFavorable"
          cursor="pointer"
          onClick={handleOrder}
          icon={
            <TooltipDefinitionTauxDevenirFavorable
              millesime={
                filters?.rentreeScolaire ?
                  getMillesimeFromRentreeScolaire({rentreeScolaire: filters?.rentreeScolaire[0], offset: 0}) :
                  CURRENT_IJ_MILLESIME
              }
            />
          }
        >
          <OrderIcon {...order} column="tauxDevenirFavorable" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxDevenirFavorable}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="tauxInsertion"
          cursor="pointer"
          onClick={handleOrder}
          icon={
            <TooltipDefinitionTauxEmploi6Mois
              millesime={
                filters?.rentreeScolaire ?
                  getMillesimeFromRentreeScolaire({rentreeScolaire: filters?.rentreeScolaire[0], offset: 0}) :
                  CURRENT_IJ_MILLESIME
              }
            />
          }
        >
          <OrderIcon {...order} column="tauxInsertion" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxInsertion}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="tauxPoursuite"
          cursor="pointer"
          onClick={handleOrder}
          icon={
            <TooltipDefinitionTauxPoursuiteEtudes
              millesime={
                filters?.rentreeScolaire ?
                  getMillesimeFromRentreeScolaire({rentreeScolaire: filters?.rentreeScolaire[0], offset: 0}) :
                  CURRENT_IJ_MILLESIME
              }
            />
          }
        >
          <OrderIcon {...order} column="tauxPoursuite" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxPoursuite}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="tauxDevenirFavorableEtablissement"
          cursor="pointer"
          onClick={handleOrder}
          icon={
            <TooltipDefinitionTauxDevenirFavorable
              millesime={
                filters?.rentreeScolaire ?
                  getMillesimeFromRentreeScolaire({rentreeScolaire: filters?.rentreeScolaire[0], offset: 0}) :
                  CURRENT_IJ_MILLESIME
              }
            />
          }
        >
          <OrderIcon {...order} column="tauxDevenirFavorableEtablissement" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxDevenirFavorableEtablissement}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="tauxInsertionEtablissement"
          cursor="pointer"
          onClick={handleOrder}
          icon={
            <TooltipDefinitionTauxEmploi6Mois
              millesime={
                filters?.rentreeScolaire ?
                  getMillesimeFromRentreeScolaire({rentreeScolaire: filters?.rentreeScolaire[0], offset: 0}) :
                  CURRENT_IJ_MILLESIME
              }
            />
          }
        >
          <OrderIcon {...order} column="tauxInsertionEtablissement" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxInsertionEtablissement}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="tauxPoursuiteEtablissement"
          cursor="pointer"
          onClick={handleOrder}
          icon={
            <TooltipDefinitionTauxPoursuiteEtudes
              millesime={
                filters?.rentreeScolaire ?
                  getMillesimeFromRentreeScolaire({rentreeScolaire: filters?.rentreeScolaire[0], offset: 0}) :
                  CURRENT_IJ_MILLESIME
              }
            />
          }
        >
          <OrderIcon {...order} column="tauxPoursuiteEtablissement" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxPoursuiteEtablissement}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="valeurAjoutee"
          isNumeric
          cursor="pointer"
          onClick={handleOrder}
          icon={<TooltipDefinitionValeurAjoutee />}
        >
          <OrderIcon {...order} column="valeurAjoutee" />
          {FORMATION_ETABLISSEMENT_COLUMNS.valeurAjoutee}
        </ConditionalTh>
      </Tr>
    </Thead>
  );
};
