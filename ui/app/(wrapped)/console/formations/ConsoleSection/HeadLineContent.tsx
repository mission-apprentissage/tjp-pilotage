import { Box, chakra, IconButton,Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
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

import { COLUMNS_WIDTH } from "./COLUMNS_WIDTH";
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
    colonneFilters: (keyof typeof FORMATION_COLUMNS)[];
    colonne: keyof typeof FORMATION_COLUMNS;
    stickyColonnes: FORMATION_COLUMNS_KEYS[];
    setStickyColonnes: React.Dispatch<React.SetStateAction<FORMATION_COLUMNS_KEYS[]>>;
    getCellBgColor: (column: keyof typeof FORMATION_COLUMNS) => string;
    order?: Partial<Order>;
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
        >
          <Box maxW={280} sx={{
            display: "flex",
            alignItems: "center",
          }}>
            <Tooltip
              label={FORMATION_COLUMNS[colonne]}
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
                {FORMATION_COLUMNS[colonne]}
              </Box>
            </Tooltip>
            {icon}
            <Tooltip
              label={`${isSticky ? "Libérer" : "Figer"} la colonne ${FORMATION_COLUMNS[colonne].toLocaleLowerCase()}`}
              placement="top"
            >
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
    <Thead boxShadow="0 0 6px 0 rgb(0,0,0,0.15)" top={0} position={"sticky"} zIndex={"docked"}>
      <Tr bg={"white"}>
        <ConditionalTh
          colonne={"rentreeScolaire"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne={"libelleDispositif"}
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
          colonne={"formationSpecifique"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionFormationSpecifique />}
        />
        <ConditionalTh
          colonne={"libelleNiveauDiplome"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne={"libelleFamille"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne={"cfd"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne={"cpc"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne={"cpcSecteur"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
        <ConditionalTh
          colonne={"libelleNsf"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionDomaineDeFormation />}
        />
        <ConditionalTh
          colonne={"nbEtablissement"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          isNumeric
        />
        <ConditionalTh
          colonne={"effectif1"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionNombreEleves />}
          isNumeric
        />
        <ConditionalTh
          colonne={"effectif2"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionNombreEleves />}
          isNumeric
        />
        <ConditionalTh
          colonne={"effectif3"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionNombreEleves />}
          isNumeric
        />
        <ConditionalTh
          colonne={"effectifEntree"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionEffectifEnEntree />}
        />
        <ConditionalTh
          colonne={"evolutionEffectif"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionNombreEleves />}
        />
        <ConditionalTh
          colonne={"tauxPression"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionTauxDePression />}
        />
        <ConditionalTh
          colonne={"evolutionTauxPression"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionTauxDePression />}
        />
        <ConditionalTh
          colonne={"tauxDemande"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionTauxDeDemande />}
        />
        <ConditionalTh
          colonne={"evolutionTauxDemande"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionTauxDeDemande />}
        />
        <ConditionalTh
          colonne={"tauxRemplissage"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionTauxRemplissage />}
        />
        <ConditionalTh
          colonne={"evolutionTauxRemplissage"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionTauxRemplissage />}
        />
        {canShowQuadrantPosition && (
          <>
            <ConditionalTh
              colonne={"positionQuadrant"}
              colonneFilters={colonneFilters}
              getCellBgColor={getCellBgColor}
              handleOrder={handleOrder}
              order={order}
              stickyColonnes={stickyColonnes}
              setStickyColonnes={setStickyColonnes}
              icon={<TooltipDefinitionPositionQuadrant />}
            />
            {/* <ConditionalTh
              colonne={"evolutionPositionQuadrant"}
              colonneFilters={colonneFilters}
              getCellBgColor={getCellBgColor}
              stickyColonnes={stickyColonnes}
              setStickyColonnes={setStickyColonnes}
            /> */}
          </>
        )}
        <ConditionalTh
          colonne={"tauxDevenirFavorable"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionTauxDevenirFavorable />}
        />
        <ConditionalTh
          colonne={"evolutionTauxDevenirFavorable"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionTauxDevenirFavorable />}
        />
        <ConditionalTh
          colonne={"tauxInsertion"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionTauxEmploi6Mois />}
        />
        <ConditionalTh
          colonne={"evolutionTauxInsertion"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionTauxEmploi6Mois />}
        />
        <ConditionalTh
          colonne={"tauxPoursuite"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
          icon={<TooltipDefinitionTauxPoursuiteEtudes />}
        />
        <ConditionalTh
          colonne={"evolutionTauxPoursuite"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          icon={<TooltipDefinitionTauxPoursuiteEtudes />}
          handleOrder={handleOrder}
          order={order}
          stickyColonnes={stickyColonnes}
          setStickyColonnes={setStickyColonnes}
        />
      </Tr>
    </Thead>
  );
};
