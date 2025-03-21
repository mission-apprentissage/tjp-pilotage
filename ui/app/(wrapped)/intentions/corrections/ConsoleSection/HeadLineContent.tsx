import {Box, chakra, Tooltip} from '@chakra-ui/react';
import type { CSSProperties } from "react";

import { CORRECTIONS_COLUMNS } from "@/app/(wrapped)/intentions/corrections/CORRECTIONS_COLUMN";
import type { OrderCorrections } from "@/app/(wrapped)/intentions/corrections/types";
import {SortableTh} from '@/components/SortableTh';
import { TauxPressionScale } from "@/components/TauxPressionScale";
import { TooltipIcon } from "@/components/TooltipIcon";

const ConditionalTh = chakra(
  ({
    className,
    children,
    style,
    colonneFilters,
    colonne,
    handleOrder,
    getCellBgColor,
    order,
    isNumeric = false,

  }: {
    className?: string;
    style?: CSSProperties;
    children: React.ReactNode;
    colonneFilters: (keyof typeof CORRECTIONS_COLUMNS)[];
    colonne: keyof typeof CORRECTIONS_COLUMNS;
    handleOrder?: (colonne: OrderCorrections["orderBy"]) => void;
    getCellBgColor: (colonne: keyof typeof CORRECTIONS_COLUMNS) => string;
    order: Partial<OrderCorrections>,
    isNumeric?: boolean;
  }) => {
    if (colonneFilters.includes(colonne))
      return (
        <SortableTh
          maxW={170}
          p={2}
          className={className}
          style={style}
          isNumeric={isNumeric}
          colonne={colonne}
          order={order}
          handleOrder={handleOrder ? (colonne) => handleOrder(colonne as OrderCorrections["orderBy"]) : undefined}
          bgColor={getCellBgColor(colonne)}
        >
          <Tooltip label={CORRECTIONS_COLUMNS[colonne]} placement="top">
            {children}
          </Tooltip>
        </SortableTh>
      );
    return null;
  },
  { shouldForwardProp: (_prop) => true },
);

export const HeadLineContent = ({
  order,
  handleOrder,
  colonneFilters,
  getCellBgColor,
}: {
  order: OrderCorrections;
  handleOrder: (column: OrderCorrections["orderBy"]) => void;
  colonneFilters: (keyof typeof CORRECTIONS_COLUMNS)[];
  getCellBgColor: (column: keyof typeof CORRECTIONS_COLUMNS) => string;
}) => {
  return (
    <>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleEtablissement"}
        minW={300}
        maxW={300}
        position="sticky"
        zIndex={"sticky"}
        left="0"
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {CORRECTIONS_COLUMNS.libelleEtablissement}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"commune"}
        left={colonneFilters.includes("libelleEtablissement") ? 300 : 0}
        position="sticky"
        zIndex={"sticky"}
        boxShadow={"inset -2px 0px 0px 0px #E2E8F0"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {CORRECTIONS_COLUMNS.commune}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleRegion"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {CORRECTIONS_COLUMNS.libelleRegion}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleAcademie"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {CORRECTIONS_COLUMNS.libelleAcademie}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"secteur"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {CORRECTIONS_COLUMNS.secteur}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleNsf"}
        minW={200}
        maxW={200}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {CORRECTIONS_COLUMNS.libelleNsf}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleFormation"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {CORRECTIONS_COLUMNS.libelleFormation}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"formationSpecifique"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {CORRECTIONS_COLUMNS.formationSpecifique}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"niveauDiplome"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {CORRECTIONS_COLUMNS.niveauDiplome}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"positionQuadrant"}
        isNumeric
        getCellBgColor={getCellBgColor}
      >
        <TooltipIcon
          mt={"auto"}
          me="1"
          label="Positionnement du point de la formation dans le quadrant par rapport aux moyennes régionales des taux d'emploi et de poursuite d'études appliquées au niveau de diplôme."
        />
        {CORRECTIONS_COLUMNS.positionQuadrant}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"tauxInsertionRegional"}
        textAlign="center"
        minW={200}
        maxW={200}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {CORRECTIONS_COLUMNS.tauxInsertionRegional}
        <TooltipIcon
          ml="1"
          label="La part de ceux qui sont en emploi 6 mois après leur sortie d’étude pour cette formation à l'échelle régionale (voie scolaire)."
        />
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"tauxPoursuiteRegional"}
        textAlign="center"
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {CORRECTIONS_COLUMNS.tauxPoursuiteRegional}
        <TooltipIcon
          ml="1"
          label="Tout élève inscrit à N+1 (réorientation et redoublement compris) pour cette formation à l'échelle régionale (voie scolaire)."
        />
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"tauxDevenirFavorableRegional"}
        textAlign="center"
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {CORRECTIONS_COLUMNS.tauxDevenirFavorableRegional}
        <TooltipIcon
          ml="2"
          label="(nombre d'élèves inscrits en formation + nombre d'élèves en emploi) / nombre d'élèves en entrée en dernière année de formation pour cette formation à l'échelle régionale (voie scolaire)."
        />
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"tauxPressionRegional"}
        textAlign="center"
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {CORRECTIONS_COLUMNS.tauxPressionRegional}
        <TooltipIcon
          ml="1"
          label={
            <>
              <Box>Le ratio entre le nombre de premiers voeux et la capacité de la formation au niveau régional.</Box>
              <TauxPressionScale />
            </>
          }
        />
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"nbEtablissement"}
        isNumeric
        minW={200}
        maxW={200}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {CORRECTIONS_COLUMNS.nbEtablissement}
        <TooltipIcon ml="1" label="Le nombre d'établissement dispensant la formation dans la région." />
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"capaciteScolaireCorrigee"}
        isNumeric
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {CORRECTIONS_COLUMNS.capaciteScolaireCorrigee}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"ecartScolaire"}
        isNumeric
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {CORRECTIONS_COLUMNS.ecartScolaire}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"capaciteApprentissageCorrigee"}
        isNumeric
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {CORRECTIONS_COLUMNS.capaciteApprentissageCorrigee}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"ecartApprentissage"}
        isNumeric
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {CORRECTIONS_COLUMNS.ecartApprentissage}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"raisonCorrection"}
        isNumeric
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {CORRECTIONS_COLUMNS.raisonCorrection}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"motifCorrection"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {CORRECTIONS_COLUMNS.motifCorrection}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleColoration"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {CORRECTIONS_COLUMNS.libelleColoration}
      </ConditionalTh>
    </>
  );
};
