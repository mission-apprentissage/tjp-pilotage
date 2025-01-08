import { Box, chakra, Th, Tooltip } from "@chakra-ui/react";
import type { CSSProperties } from "react";

import { CORRECTIONS_COLUMNS } from "@/app/(wrapped)/intentions/corrections/CORRECTIONS_COLUMN";
import type { OrderCorrections } from "@/app/(wrapped)/intentions/corrections/types";
import { STATS_DEMANDES_COLUMNS } from "@/app/(wrapped)/intentions/restitution/STATS_DEMANDES_COLUMN";
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
    onClick,
    isNumeric = false,
  }: {
    className?: string;
    style?: CSSProperties;
    children: React.ReactNode;
    colonneFilters: (keyof typeof CORRECTIONS_COLUMNS)[];
    colonne: keyof typeof CORRECTIONS_COLUMNS;
    onClick?: (column: OrderCorrections["orderBy"]) => void;
    isNumeric?: boolean;
  }) => {
    if (colonneFilters.includes(colonne))
      return (
        <Tooltip label={CORRECTIONS_COLUMNS[colonne]} placement="top">
          <Th
            className={className}
            style={style}
            isNumeric={isNumeric}
            maxW={170}
            p={2}
            cursor={onClick ? "pointer" : "default"}
            whiteSpace="nowrap"
            onClick={() => onClick && onClick(colonne as OrderCorrections["orderBy"])}
            fontSize={12}
            fontWeight={700}
            lineHeight={"20px"}
            textTransform={"uppercase"}
            textOverflow={"ellipsis"}
            alignSelf={"stretch"}
            isTruncated
          >
            {children}
          </Th>
        </Tooltip>
      );
    return null;
  },
);

export const HeadLineContent = ({
  order,
  handleOrder,
  colonneFilters,
  getCellColor,
}: {
  order: OrderCorrections;
  handleOrder: (column: OrderCorrections["orderBy"]) => void;
  colonneFilters: (keyof typeof CORRECTIONS_COLUMNS)[];
  getCellColor: (column: keyof typeof CORRECTIONS_COLUMNS) => string;
}) => {
  return (
    <>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleEtablissement"}
        onClick={handleOrder}
        minW={300}
        maxW={300}
        position="sticky"
        zIndex={"sticky"}
        left="0"
        bgColor={getCellColor("libelleEtablissement")}
      >
        <OrderIcon {...order} column="libelleEtablissement" />
        {CORRECTIONS_COLUMNS.libelleEtablissement}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"commune"}
        onClick={handleOrder}
        left={colonneFilters.includes("libelleEtablissement") ? 300 : 0}
        position="sticky"
        zIndex={"sticky"}
        boxShadow={"inset -2px 0px 0px 0px #E2E8F0"}
        bgColor={getCellColor("commune")}
      >
        <OrderIcon {...order} column="commune" />
        {CORRECTIONS_COLUMNS.commune}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleRegion"}
        onClick={handleOrder}
        bgColor={getCellColor("libelleRegion")}
      >
        <OrderIcon {...order} column="libelleRegion" />
        {CORRECTIONS_COLUMNS.libelleRegion}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleAcademie"}
        onClick={handleOrder}
        bgColor={getCellColor("libelleAcademie")}
      >
        <OrderIcon {...order} column="libelleAcademie" />
        {CORRECTIONS_COLUMNS.libelleAcademie}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"secteur"}
        onClick={handleOrder}
        bgColor={getCellColor("secteur")}
      >
        <OrderIcon {...order} column="secteur" />
        {CORRECTIONS_COLUMNS.secteur}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleNsf"}
        onClick={handleOrder}
        minW={200}
        maxW={200}
        bgColor={getCellColor("libelleNsf")}
      >
        <OrderIcon {...order} column="libelleNsf" />
        {CORRECTIONS_COLUMNS.libelleNsf}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleFormation"}
        onClick={handleOrder}
        bgColor={getCellColor("libelleFormation")}
      >
        <OrderIcon {...order} column="libelleFormation" />
        {CORRECTIONS_COLUMNS.libelleFormation}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"formationSpecifique"}
        bgColor={getCellColor("formationSpecifique")}
      >
        <OrderIcon {...order} column="formationSpecifique" />
        {CORRECTIONS_COLUMNS.formationSpecifique}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"niveauDiplome"}
        onClick={handleOrder}
        bgColor={getCellColor("niveauDiplome")}
      >
        <OrderIcon {...order} column="niveauDiplome" />
        {CORRECTIONS_COLUMNS.niveauDiplome}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"positionQuadrant"}
        isNumeric
        bgColor={getCellColor("positionQuadrant")}
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
        onClick={handleOrder}
        textAlign="center"
        minW={200}
        maxW={200}
        bgColor={getCellColor("tauxInsertionRegional")}
      >
        <OrderIcon {...order} column="tauxInsertionRegional" />
        {CORRECTIONS_COLUMNS.tauxInsertionRegional}
        <TooltipIcon
          ml="1"
          label="La part de ceux qui sont en emploi 6 mois après leur sortie d’étude pour cette formation à l'échelle régionale (voie scolaire)."
        />
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"tauxPoursuiteRegional"}
        onClick={handleOrder}
        textAlign="center"
        bgColor={getCellColor("tauxPoursuiteRegional")}
      >
        <OrderIcon {...order} column="tauxPoursuiteRegional" />
        {CORRECTIONS_COLUMNS.tauxPoursuiteRegional}
        <TooltipIcon
          ml="1"
          label="Tout élève inscrit à N+1 (réorientation et redoublement compris) pour cette formation à l'échelle régionale (voie scolaire)."
        />
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"tauxDevenirFavorableRegional"}
        onClick={handleOrder}
        textAlign="center"
        bgColor={getCellColor("tauxDevenirFavorableRegional")}
      >
        <OrderIcon {...order} column="tauxDevenirFavorableRegional" />
        {CORRECTIONS_COLUMNS.tauxDevenirFavorableRegional}
        <TooltipIcon
          ml="2"
          label="(nombre d'élèves inscrits en formation + nombre d'élèves en emploi) / nombre d'élèves en entrée en dernière année de formation pour cette formation à l'échelle régionale (voie scolaire)."
        />
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"tauxPressionRegional"}
        onClick={handleOrder}
        textAlign="center"
        bgColor={getCellColor("tauxPressionRegional")}
      >
        <OrderIcon {...order} column="tauxPressionRegional" />
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
        onClick={handleOrder}
        isNumeric
        minW={200}
        maxW={200}
        bgColor={getCellColor("nbEtablissement")}
      >
        <OrderIcon {...order} column="nbEtablissement" />
        {CORRECTIONS_COLUMNS.nbEtablissement}
        <TooltipIcon ml="1" label="Le nombre d'établissement dispensant la formation dans la région." />
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"capaciteScolaireCorrigee"}
        onClick={handleOrder}
        isNumeric
        bgColor={getCellColor("capaciteScolaireCorrigee")}
      >
        <OrderIcon {...order} column="capaciteScolaireCorrigee" />
        {CORRECTIONS_COLUMNS.capaciteScolaireCorrigee}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"ecartScolaire"}
        onClick={handleOrder}
        isNumeric
        bgColor={getCellColor("ecartScolaire")}
      >
        <OrderIcon {...order} column="ecartScolaire" />
        {CORRECTIONS_COLUMNS.ecartScolaire}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"capaciteApprentissageCorrigee"}
        onClick={handleOrder}
        isNumeric
        bgColor={getCellColor("capaciteApprentissageCorrigee")}
      >
        <OrderIcon {...order} column="capaciteApprentissageCorrigee" />
        {CORRECTIONS_COLUMNS.capaciteApprentissageCorrigee}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"ecartApprentissage"}
        onClick={handleOrder}
        isNumeric
        bgColor={getCellColor("ecartApprentissage")}
      >
        <OrderIcon {...order} column="ecartApprentissage" />
        {CORRECTIONS_COLUMNS.ecartApprentissage}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"raisonCorrection"}
        onClick={handleOrder}
        isNumeric
        bgColor={getCellColor("raisonCorrection")}
      >
        <OrderIcon {...order} column="raisonCorrection" />
        {CORRECTIONS_COLUMNS.raisonCorrection}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"motifCorrection"}
        onClick={handleOrder}
        bgColor={getCellColor("motifCorrection")}
      >
        <OrderIcon {...order} column="motifCorrection" />
        {CORRECTIONS_COLUMNS.motifCorrection}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleColoration"}
        onClick={handleOrder}
        bgColor={getCellColor("libelleColoration")}
      >
        <OrderIcon {...order} column="libelleColoration" />
        {CORRECTIONS_COLUMNS.libelleColoration}
      </ConditionalTh>
    </>
  );
};
