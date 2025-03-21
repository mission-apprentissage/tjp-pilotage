import {Box, chakra, shouldForwardProp,Text, Th, Thead, Tooltip, Tr, VisuallyHidden} from '@chakra-ui/react';
import { usePlausible } from "next-plausible";
import type { CSSProperties } from "react";

import { FORMATION_COLUMNS } from "@/app/(wrapped)/console/formations/FORMATION_COLUMNS";
import type { Filters, Order } from "@/app/(wrapped)/console/formations/types";
import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import {SortableTh} from '@/components/SortableTh';
import { TauxPressionScale } from "@/components/TauxPressionScale";
import { TooltipIcon } from "@/components/TooltipIcon";

const ConditionalTh = chakra(
  ({
    className,
    children,
    style,
    order,
    colonneFilters,
    colonne,
    getCellBgColor,
    handleOrder,
    isNumeric = false,
  }: {
    className?: string;
    style?: CSSProperties;
    order: Partial<Order>,
    children: React.ReactNode;
    colonneFilters: (keyof typeof FORMATION_COLUMNS)[];
    colonne: keyof typeof FORMATION_COLUMNS;
    getCellBgColor: (column: keyof typeof FORMATION_COLUMNS) => string;
    handleOrder?: (column: Order["orderBy"]) => void;
    isNumeric?: boolean;
  }) => {
    if (colonneFilters.includes(colonne))
      return (
        <SortableTh
          maxW={300}
          p={2}
          isNumeric={isNumeric}
          colonne={colonne}
          order={order}
          handleOrder={handleOrder ? (colonne) => handleOrder(colonne as Order["orderBy"]) : undefined}
          bgColor={getCellBgColor(colonne)}
          className={className}
          style={style}
        >
          <Tooltip label={FORMATION_COLUMNS[colonne]} placement="top">
            {children}
          </Tooltip>
        </SortableTh>
      );
    return null;
  },
  {
    shouldForwardProp: (prop) => shouldForwardProp(prop) || prop === "colonneFilters" || prop === "getCellBgColor" || prop === "colonne" || prop === "order",
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
          handleOrder={handleOrder}
          order={order}
        >
          {FORMATION_COLUMNS.libelleDispositif}
        </ConditionalTh>
        <ConditionalTh
          colonne={"libelleFormation"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          minW={450}
          left={0}
          zIndex={1}
          position={{ lg: "relative", xl: "sticky" }}
          boxShadow={{
            lg: "none",
            xl: isSticky ? "inset -2px 0px 0px 0px #E2E8F0" : "none",
          }}
          handleOrder={handleOrder}
          order={order}
        >
          {FORMATION_COLUMNS.libelleFormation}
        </ConditionalTh>
        <ConditionalTh colonne={"formationSpecifique"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
          {FORMATION_COLUMNS.formationSpecifique}
          <TooltipIcon
            ml="1"
            label="Cliquez pour plus d'infos."
            onClick={() => openGlossaire("formation-specifique")}
          />
        </ConditionalTh>
        <ConditionalTh
          colonne={"libelleNiveauDiplome"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
        >
          {FORMATION_COLUMNS.libelleNiveauDiplome}
        </ConditionalTh>
        <ConditionalTh
          colonne={"libelleFamille"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
        >
          {FORMATION_COLUMNS.libelleFamille}
        </ConditionalTh>
        <ConditionalTh
          colonne={"cfd"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
        >
          {FORMATION_COLUMNS.cfd}
        </ConditionalTh>
        <ConditionalTh
          colonne={"cpc"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
        >
          {FORMATION_COLUMNS.cpc}
        </ConditionalTh>
        <ConditionalTh
          colonne={"cpcSecteur"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
        >
          {FORMATION_COLUMNS.cpcSecteur}
        </ConditionalTh>
        <ConditionalTh
          colonne={"libelleNsf"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          handleOrder={handleOrder}
          order={order}
        >
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
          handleOrder={handleOrder}
          order={order}
        >
          {FORMATION_COLUMNS.nbEtablissement}
        </ConditionalTh>
        <ConditionalTh
          colonne={"effectif1"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          isNumeric
          handleOrder={handleOrder}
          order={order}
        >
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
          handleOrder={handleOrder}
          order={order}
        >
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
          handleOrder={handleOrder}
          order={order}
        >
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
          handleOrder={handleOrder}
          order={order}
        >
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
          textAlign={"center"}
          handleOrder={handleOrder}
          order={order}
        >
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
          textAlign={"center"}
          handleOrder={handleOrder}
          order={order}
        >
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
            handleOrder={handleOrder}
            order={order}
          >
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
          textAlign={"center"}
          handleOrder={handleOrder}
          order={order}
        >
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
          textAlign={"center"}
          handleOrder={handleOrder}
          order={order}
        >
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
          textAlign={"center"}
          handleOrder={handleOrder}
          order={order}
        >
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
