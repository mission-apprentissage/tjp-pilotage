import { Box, chakra, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { usePlausible } from "next-plausible";
import type { CSSProperties } from "react";

import { FORMATION_COLUMNS } from "@/app/(wrapped)/console/formations/FORMATION_COLUMNS";
import type { Filters, Order } from "@/app/(wrapped)/console/formations/types";
import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { OrderIcon } from "@/components/OrderIcon";
import { TauxPressionScale } from "@/components/TauxPressionScale";
import { TooltipIcon } from "@/components/TooltipIcon";

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
  }: {
    className?: string;
    style?: CSSProperties;
    children: React.ReactNode;
    colonneFilters: (keyof typeof FORMATION_COLUMNS)[];
    colonne: keyof typeof FORMATION_COLUMNS;
    getCellBgColor: (column: keyof typeof FORMATION_COLUMNS) => string;
    onClick?: (column: Order["orderBy"]) => void;
    isNumeric?: boolean;
  }) => {
    if (colonneFilters.includes(colonne))
      return (
        <Th
          maxW={300}
          p={2}
          className={className}
          style={style}
          isNumeric={isNumeric}
          cursor={onClick ? "pointer" : "default"}
          onClick={() => onClick && onClick(colonne as Order["orderBy"])}
          bgColor={getCellBgColor(colonne)}
        >
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
  const { openGlossaire } = useGlossaireContext();
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
        <Th />
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
        <ConditionalTh colonne={"formationSpecifique"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
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
        >
          <OrderIcon {...order} column="libelleNsf" />
          {FORMATION_COLUMNS.libelleNsf}
          <TooltipIcon
            ml="1"
            label="Cliquez pour plus d'infos."
            onClick={() => openGlossaire("domaine-de-formation-nsf")}
          />
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
          colonne={"effectif1"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          isNumeric
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="effectif1" />
          {FORMATION_COLUMNS.effectif1}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>Nb d'élèves</Text>
                <Text>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            onClick={() => openGlossaire("nombre-deleves")}
          />
        </ConditionalTh>
        <ConditionalTh
          colonne={"effectif2"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          isNumeric
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="effectif2" />
          {FORMATION_COLUMNS.effectif2}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>Nb d'élèves</Text>
                <Text>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            onClick={() => openGlossaire("nombre-deleves")}
          />
        </ConditionalTh>
        <ConditionalTh
          colonne={"effectif3"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          isNumeric
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="effectif3" />
          {FORMATION_COLUMNS.effectif3}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>Nb d'élèves</Text>
                <Text>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            onClick={() => openGlossaire("nombre-deleves")}
          />
        </ConditionalTh>
        <ConditionalTh
          colonne={"effectifEntree"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="effectifEntree" />
          {FORMATION_COLUMNS.effectifEntree}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>Effectifs en entrée en première année de formation.</Text>
                <Text>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            onClick={() => openGlossaire("effectif-en-entree")}
          />
        </ConditionalTh>
        <ConditionalTh
          colonne={"tauxPression"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          cursor="pointer"
          onClick={handleOrder}
          textAlign={"center"}
        >
          <OrderIcon {...order} column="tauxPression" />
          {FORMATION_COLUMNS.tauxPression}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>
                  Le ratio entre le nombre de premiers voeux et la capacité de la formation au niveau régional.
                </Text>
                <Text>Cliquez pour plus d'infos.</Text>
                <TauxPressionScale />
              </Box>
            }
            onClick={() => openGlossaire("taux-de-pression")}
          />
        </ConditionalTh>
        <ConditionalTh
          colonne={"tauxRemplissage"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          cursor="pointer"
          onClick={handleOrder}
          textAlign={"center"}
        >
          <OrderIcon {...order} column="tauxRemplissage" />
          {FORMATION_COLUMNS.tauxRemplissage}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>Le ratio entre l’effectif d’entrée en formation et sa capacité.</Text>
                <Text>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            onClick={() => openGlossaire("taux-de-remplissage")}
          />
        </ConditionalTh>
        {canShowQuadrantPosition && (
          <ConditionalTh
            colonne={"positionQuadrant"}
            colonneFilters={colonneFilters}
            getCellBgColor={getCellBgColor}
            cursor="pointer"
            onClick={handleOrder}
          >
            <OrderIcon {...order} column="positionQuadrant" />
            {FORMATION_COLUMNS.positionQuadrant}
            <TooltipIcon
              ml="1"
              label={
                <Box>
                  <Text>
                    Positionnement du point de la formation dans le quadrant par rapport aux moyennes régionales des
                    taux d'emploi et de poursuite d'études appliquées au niveau de diplôme.
                  </Text>
                  <Text>Cliquez pour plus d'infos.</Text>
                </Box>
              }
              onClick={() => openGlossaire("quadrant")}
            />
          </ConditionalTh>
        )}
        <ConditionalTh
          colonne={"tauxInsertion"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          cursor="pointer"
          onClick={handleOrder}
          textAlign={"center"}
        >
          <OrderIcon {...order} column="tauxInsertion" />
          {FORMATION_COLUMNS.tauxInsertion}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>La part de ceux qui sont en emploi 6 mois après leur sortie d’étude.</Text>
                <Text>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            onClick={() => openGlossaire("taux-emploi-6-mois")}
          />
        </ConditionalTh>
        <ConditionalTh
          colonne={"tauxPoursuite"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          cursor="pointer"
          onClick={handleOrder}
          textAlign={"center"}
        >
          <OrderIcon {...order} column="tauxPoursuite" />
          {FORMATION_COLUMNS.tauxPoursuite}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>Tout élève inscrit à N+1 (réorientation et redoublement compris).</Text>
                <Text>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            onClick={() => openGlossaire("taux-poursuite-etudes")}
          />
        </ConditionalTh>
        <ConditionalTh
          colonne={"tauxDevenirFavorable"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          cursor="pointer"
          onClick={handleOrder}
          textAlign={"center"}
        >
          <OrderIcon {...order} column="tauxDevenirFavorable" />
          {FORMATION_COLUMNS.tauxDevenirFavorable}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>
                  (nombre d'élèves inscrits en formation + nombre d'élèves en emploi) / nombre d'élèves en entrée en
                  dernière année de formation.
                </Text>
                <Text>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            onClick={() => openGlossaire("taux-de-devenir-favorable")}
          />
        </ConditionalTh>
      </Tr>
    </Thead>
  );
};
