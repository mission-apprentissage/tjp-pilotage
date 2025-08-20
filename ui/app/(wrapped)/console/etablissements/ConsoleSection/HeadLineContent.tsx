import { Box, chakra, IconButton, Th, Thead, Tooltip, Tr, VisuallyHidden } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { usePlausible } from "next-plausible";
import type {CSSProperties} from "react";
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
import { FORMATION_ETABLISSEMENT_COLUMNS, FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED } from "@/app/(wrapped)/console/etablissements/FORMATION_ETABLISSEMENT_COLUMNS";
import type {Filters, FORMATION_ETABLISSEMENT_COLUMNS_KEYS,Order} from "@/app/(wrapped)/console/etablissements/types";
import { CHEVRON_COLUMN_WIDTH } from "@/app/(wrapped)/console/formations/ConsoleSection/COLUMNS_WIDTH";
import { OrderIcon } from "@/components/OrderIcon";
import { feature } from "@/utils/feature";

import { COLUMNS_WIDTH } from "./COLUMNS_WIDTH";
import { getLeftOffset, isColonneSticky  } from "./utils";

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
    colonneFilters: FORMATION_ETABLISSEMENT_COLUMNS_KEYS[];
    colonne: FORMATION_ETABLISSEMENT_COLUMNS_KEYS;
    stickyColonnes: FORMATION_ETABLISSEMENT_COLUMNS_KEYS[];
    setStickyColonnes: React.Dispatch<React.SetStateAction<FORMATION_ETABLISSEMENT_COLUMNS_KEYS[]>>;
    getCellBgColor: (column: FORMATION_ETABLISSEMENT_COLUMNS_KEYS) => string;
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
          <Box sx={{
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
            <Tooltip label={`${isSticky ? "Libérer" : "Figer"} la colonne ${FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED[colonne].toLocaleLowerCase()}`} placement="top">
              <IconButton
                aria-label={`Figer la colonne ${FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED[colonne].toLocaleLowerCase()}`}
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
                      return prev.filter((c) => c !== colonne) as FORMATION_ETABLISSEMENT_COLUMNS_KEYS[];
                    }
                    return ([...prev, colonne] as FORMATION_ETABLISSEMENT_COLUMNS_KEYS[]).sort((a, b) =>
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
  stickyColonnes,
  setStickyColonnes,
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
  stickyColonnes: FORMATION_ETABLISSEMENT_COLUMNS_KEYS[];
  setStickyColonnes: React.Dispatch<React.SetStateAction<FORMATION_ETABLISSEMENT_COLUMNS_KEYS[]>>;
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
    <Thead boxShadow="0 0 6px 0 rgb(0,0,0,0.15)" top={0} position={"sticky"} zIndex={"docked"}>
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
          colonne="rentreeScolaire"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          {FORMATION_ETABLISSEMENT_COLUMNS.rentreeScolaire}
        </ConditionalTh>
        <ConditionalTh
          colonne="libelleEtablissement"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          <OrderIcon {...order} column="libelleEtablissement" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleEtablissement}
        </ConditionalTh>
        <ConditionalTh
          colonne="commune"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          <OrderIcon {...order} column="commune" />
          {FORMATION_ETABLISSEMENT_COLUMNS.commune}
        </ConditionalTh>
        <ConditionalTh
          colonne="libelleDepartement"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          <OrderIcon {...order} column="libelleDepartement" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleDepartement}
        </ConditionalTh>
        <ConditionalTh
          colonne="libelleAcademie"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          <OrderIcon {...order} column="libelleAcademie" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleAcademie}
        </ConditionalTh>
        <ConditionalTh
          colonne="libelleRegion"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          <OrderIcon {...order} column="libelleRegion" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleRegion}
        </ConditionalTh>
        <ConditionalTh
          colonne="secteur"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          <OrderIcon {...order} column="secteur" />
          {FORMATION_ETABLISSEMENT_COLUMNS.secteur}
        </ConditionalTh>
        <ConditionalTh
          colonne="uai"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          <OrderIcon {...order} column="uai" />
          {FORMATION_ETABLISSEMENT_COLUMNS.uai}
        </ConditionalTh>
        <ConditionalTh
          colonne="libelleDispositif"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          <OrderIcon {...order} column="libelleDispositif" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleDispositif}
        </ConditionalTh>
        <ConditionalTh
          colonne="libelleFormation"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          <OrderIcon {...order} column="libelleFormation" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleFormation}
        </ConditionalTh>
        <ConditionalTh
          colonne={"formationSpecifique"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionFormationSpecifique /> }
        >
          {FORMATION_ETABLISSEMENT_COLUMNS.formationSpecifique}
        </ConditionalTh>
        <ConditionalTh
          colonne="libelleNiveauDiplome"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          <OrderIcon {...order} column="libelleNiveauDiplome" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleNiveauDiplome}
        </ConditionalTh>
        <ConditionalTh
          colonne="libelleFamille"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          <OrderIcon {...order} column="libelleFamille" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleFamille}
        </ConditionalTh>
        <ConditionalTh
          colonne="cfd"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          <OrderIcon {...order} column="cfd" />
          {FORMATION_ETABLISSEMENT_COLUMNS.cfd}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="cpc"
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          <OrderIcon {...order} column="cpc" />
          {FORMATION_ETABLISSEMENT_COLUMNS.cpc}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="cpcSecteur"
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        >
          <OrderIcon {...order} column="cpcSecteur" />
          {FORMATION_ETABLISSEMENT_COLUMNS.cpcSecteur}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="libelleNsf"
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionDomaineDeFormation />}
        >
          <OrderIcon {...order} column="libelleNsf" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleNsf}
        </ConditionalTh>{feature.donneesTransfoConsole && user && (
          <>
            <ConditionalTh
              colonne="numero"
              colonneFilters={colonneFilters}
              getCellBgColor={getCellBgColor}
              onClick={handleOrder}
              stickyColonnes={stickyColonnes}
              setStickyColonnes={setStickyColonnes}
            >
              <OrderIcon {...order} column="numero" />
              {FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED.numero}
            </ConditionalTh>
            <ConditionalTh
              colonne="dateEffetTransformation"
              colonneFilters={colonneFilters}
              getCellBgColor={getCellBgColor}
              onClick={handleOrder}
              stickyColonnes={stickyColonnes}
              setStickyColonnes={setStickyColonnes}
            >
              <OrderIcon {...order} column="dateEffetTransformation" />
              {FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED.dateEffetTransformation}
            </ConditionalTh>
            <ConditionalTh
              colonne="typeDemande"
              colonneFilters={colonneFilters}
              getCellBgColor={getCellBgColor}
              onClick={handleOrder}
              stickyColonnes={stickyColonnes}
              setStickyColonnes={setStickyColonnes}
            >
              <OrderIcon {...order} column="typeDemande" />
              {FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED.typeDemande}
            </ConditionalTh>
          </>
        )}
        <ConditionalTh
          colonne="effectif1"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionNombreEleves /> }
          isNumeric
        >
          <OrderIcon {...order} column="effectif1" />
          {FORMATION_ETABLISSEMENT_COLUMNS.effectif1}
        </ConditionalTh>
        <ConditionalTh
          colonne="effectif2"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionNombreEleves /> }
          isNumeric
        >
          <OrderIcon {...order} column="effectif2" />
          {FORMATION_ETABLISSEMENT_COLUMNS.effectif2}
        </ConditionalTh>
        <ConditionalTh
          colonne="effectif3"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionNombreEleves /> }
          isNumeric
        >
          <OrderIcon {...order} column="effectif3" />
          {FORMATION_ETABLISSEMENT_COLUMNS.effectif3}
        </ConditionalTh>
        <ConditionalTh
          colonne="effectifEntree"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionEffectifEnEntree /> }
          isNumeric
        >
          <OrderIcon {...order} column="effectifEntree" />
          {FORMATION_ETABLISSEMENT_COLUMNS.effectifEntree}
        </ConditionalTh>
        <ConditionalTh
          colonne="capacite"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          isNumeric
        >
          <OrderIcon {...order} column="capacite" />
          {FORMATION_ETABLISSEMENT_COLUMNS.capacite}
        </ConditionalTh>
        <ConditionalTh
          colonne="tauxPression"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionTauxDePression rentreeScolaire={filters?.rentreeScolaire?.[0]} />}
        >
          <OrderIcon {...order} column="tauxPression" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxPression}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="tauxDemande"
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionTauxDeDemande rentreeScolaire={filters?.rentreeScolaire?.[0]} /> }
        >
          <OrderIcon {...order} column="tauxDemande" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxDemande}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="tauxRemplissage"
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionTauxRemplissage rentreeScolaire={filters?.rentreeScolaire?.[0]} /> }
        >
          <OrderIcon {...order} column="tauxRemplissage" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxRemplissage}
        </ConditionalTh>
        <ConditionalTh
          colonne="positionQuadrant"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
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
          colonne="tauxDevenirFavorable"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
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
          colonne="tauxInsertion"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
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
          colonne="tauxPoursuite"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
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
          colonne="tauxDevenirFavorableEtablissement"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
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
          colonne="tauxInsertionEtablissement"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
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
          colonne="tauxPoursuiteEtablissement"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
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
          colonne="valeurAjoutee"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          onClick={handleOrder}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionValeurAjoutee />}
          isNumeric
        >
          <OrderIcon {...order} column="valeurAjoutee" />
          {FORMATION_ETABLISSEMENT_COLUMNS.valeurAjoutee}
        </ConditionalTh>
      </Tr>
    </Thead>
  );
};
