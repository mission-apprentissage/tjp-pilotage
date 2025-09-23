import { Box, chakra, IconButton, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
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
import { FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED } from "@/app/(wrapped)/console/etablissements/FORMATION_ETABLISSEMENT_COLUMNS";
import type {Filters, FORMATION_ETABLISSEMENT_COLUMNS_KEYS,Order} from "@/app/(wrapped)/console/etablissements/types";
import { OrderIcon } from "@/components/OrderIcon";

import { COLUMNS_WIDTH } from "./COLUMNS_WIDTH";
import { getLeftOffset, isColonneSticky  } from "./utils";

const ConditionalTh = chakra(
  ({
    className,
    style,
    colonneFilters,
    colonne,
    stickyColonnes,
    setStickyColonnes,
    getCellBgColor,
    handleOrder,
    order,
    isNumeric = false,
    icon
  }: {
    className?: string;
    style?: CSSProperties;
    colonneFilters: FORMATION_ETABLISSEMENT_COLUMNS_KEYS[];
    colonne: FORMATION_ETABLISSEMENT_COLUMNS_KEYS;
    stickyColonnes: FORMATION_ETABLISSEMENT_COLUMNS_KEYS[];
    setStickyColonnes: React.Dispatch<React.SetStateAction<FORMATION_ETABLISSEMENT_COLUMNS_KEYS[]>>;
    getCellBgColor: (column: FORMATION_ETABLISSEMENT_COLUMNS_KEYS) => string;
    handleOrder?: (column: Order["orderBy"]) => void;
    order?: Partial<Order>;
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
        >
          <Box sx={{
            display: "flex",
            alignItems: "center",
          }}>
            <Tooltip
              label={FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED[colonne]}
              placement="top"
            >
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
                {handleOrder && (<OrderIcon {...order} column={colonne} />)}
                {FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED[colonne]}
              </Box>
            </Tooltip>
            {icon}
            <Tooltip
              label={`${isSticky ? "Libérer" : "Figer"} la colonne ${FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED[colonne].toLocaleLowerCase()}`}
              placement="top"
            >
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
        <ConditionalTh
          colonne="rentreeScolaire"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne="libelleEtablissement"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne="commune"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne="libelleDepartement"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne="libelleAcademie"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne="libelleRegion"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne="secteur"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne="uai"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne="libelleDispositif"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne="libelleFormation"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne={"formationSpecifique"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionFormationSpecifique /> }
        />
        <ConditionalTh
          colonne="libelleNiveauDiplome"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne="libelleFamille"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne="cfd"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne="cpc"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne="cpcSecteur"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne="libelleNsf"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionDomaineDeFormation />}
        />
        {user && (
          <>
            <ConditionalTh
              colonne="numero"
              colonneFilters={colonneFilters}
              getCellBgColor={getCellBgColor}
              handleOrder={handleOrder}
              order={order}
              stickyColonnes={stickyColonnes}
              setStickyColonnes={setStickyColonnes}
            />
            <ConditionalTh
              colonne="dateEffetTransformation"
              colonneFilters={colonneFilters}
              getCellBgColor={getCellBgColor}
              handleOrder={handleOrder}
              order={order}
              stickyColonnes={stickyColonnes}
              setStickyColonnes={setStickyColonnes}
            />
            <ConditionalTh
              colonne="typeDemande"
              colonneFilters={colonneFilters}
              getCellBgColor={getCellBgColor}
              handleOrder={handleOrder}
              order={order}
              stickyColonnes={stickyColonnes}
              setStickyColonnes={setStickyColonnes}
            />
            <ConditionalTh
              colonne="previsionnel"
              colonneFilters={colonneFilters}
              getCellBgColor={getCellBgColor}
              stickyColonnes={stickyColonnes}
              setStickyColonnes={setStickyColonnes}
            />
          </>
        )}
        <ConditionalTh
          colonne={"effectif1"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionNombreEleves /> }
          isNumeric
        />
        <ConditionalTh
          colonne="effectif2"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionNombreEleves /> }
          isNumeric
        />
        <ConditionalTh
          colonne="effectif3"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionNombreEleves /> }
          isNumeric
        />
        <ConditionalTh
          colonne="effectifEntree"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionEffectifEnEntree /> }
          isNumeric
        />
        <ConditionalTh
          colonne={"evolutionEffectif"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne="capacite"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          isNumeric
        />
        <ConditionalTh
          colonne="evolutionCapacite"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne="tauxPression"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionTauxDePression rentreeScolaire={filters?.rentreeScolaire?.[0]} />}
        />
        <ConditionalTh
          colonne={"evolutionTauxPression"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="tauxDemande"
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionTauxDeDemande rentreeScolaire={filters?.rentreeScolaire?.[0]} /> }
        />
        <ConditionalTh
          colonne={"evolutionTauxDemande"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="tauxRemplissage"
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionTauxRemplissage rentreeScolaire={filters?.rentreeScolaire?.[0]} /> }
        />
        <ConditionalTh
          colonne={"evolutionTauxRemplissage"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne="positionQuadrant"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
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
        />
        {/* <ConditionalTh
          colonne="evolutionPositionQuadrant"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        /> */}
        <ConditionalTh
          colonne="tauxDevenirFavorable"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
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
        />
        <ConditionalTh
          colonne={"evolutionTauxDevenirFavorable"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne="tauxInsertion"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
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
        />
        <ConditionalTh
          colonne={"evolutionTauxInsertion"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne="tauxPoursuite"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
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
        />
        <ConditionalTh
          colonne={"evolutionTauxPoursuite"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne="tauxDevenirFavorableEtablissement"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
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
        />
        <ConditionalTh
          colonne={"evolutionTauxDevenirFavorable"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
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
        />
        <ConditionalTh
          colonne="tauxInsertionEtablissement"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
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
        />
        <ConditionalTh
          colonne={"evolutionTauxInsertionEtablissement"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
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
        />
        <ConditionalTh
          colonne="tauxPoursuiteEtablissement"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
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
        />
        <ConditionalTh
          colonne={"evolutionTauxPoursuiteEtablissement"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
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
        />
        <ConditionalTh
          colonne="valeurAjoutee"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionValeurAjoutee />}
          isNumeric
        />
      </Tr>
    </Thead>
  );
};
