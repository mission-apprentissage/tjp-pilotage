import { Box, chakra, Th, Tooltip } from "@chakra-ui/react";
import type { CSSProperties } from "react";

import { TooltipDefinitionPositionQuadrant } from "@/app/(wrapped)/components/definitions/DefinitionPositionQuadrant";
import { TooltipDefinitionTauxDePression } from "@/app/(wrapped)/components/definitions/DefinitionTauxDePression";
import { TooltipDefinitionTauxDevenirFavorable } from "@/app/(wrapped)/components/definitions/DefinitionTauxDevenirFavorable";
import { TooltipDefinitionTauxEmploi6Mois } from "@/app/(wrapped)/components/definitions/DefinitionTauxEmploio6Mois";
import { TooltipDefinitionTauxPoursuiteEtudes } from "@/app/(wrapped)/components/definitions/DefinitionTauxPoursuiteEtudes";
import { CORRECTIONS_COLUMNS } from "@/app/(wrapped)/demandes/corrections/CORRECTIONS_COLUMN";
import type { OrderCorrections } from "@/app/(wrapped)/demandes/corrections/types";
import { OrderIcon } from "@/components/OrderIcon";
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
    icon
  }: {
    className?: string;
    style?: CSSProperties;
    children: React.ReactNode;
    colonneFilters: (keyof typeof CORRECTIONS_COLUMNS)[];
    colonne: keyof typeof CORRECTIONS_COLUMNS;
    onClick?: (column: OrderCorrections["orderBy"]) => void;
    isNumeric?: boolean;
    icon?: React.ReactNode;
  }) => {
    if (colonneFilters.includes(colonne))
      return (
        <Th
          className={className}
          style={style}
          isNumeric={isNumeric}
          p={2}
          cursor={onClick ? "pointer" : "default"}
          whiteSpace="nowrap"
          onClick={() => onClick && onClick(colonne as OrderCorrections["orderBy"])}
        >

          <Box maxW={170} sx={{
            display: "flex",
            alignItems: "center",
          }}>
            <Tooltip label={CORRECTIONS_COLUMNS[colonne]} placement="top">
              <Box
                fontSize={12}
                fontWeight={700}
                lineHeight={"20px"}
                textTransform={"uppercase"}
                textOverflow={"ellipsis"}
                alignSelf={"stretch"}
                isTruncated
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
        icon={
          <TooltipDefinitionPositionQuadrant />
        }
      >
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
        icon={<TooltipDefinitionTauxEmploi6Mois />}
      >
        <OrderIcon {...order} column="tauxInsertionRegional" />
        {CORRECTIONS_COLUMNS.tauxInsertionRegional}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"tauxPoursuiteRegional"}
        onClick={handleOrder}
        textAlign="center"
        bgColor={getCellColor("tauxPoursuiteRegional")}
        icon={<TooltipDefinitionTauxPoursuiteEtudes />}
      >
        <OrderIcon {...order} column="tauxPoursuiteRegional" />
        {CORRECTIONS_COLUMNS.tauxPoursuiteRegional}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"tauxDevenirFavorableRegional"}
        onClick={handleOrder}
        textAlign="center"
        bgColor={getCellColor("tauxDevenirFavorableRegional")}
        icon={<TooltipDefinitionTauxDevenirFavorable />}
      >
        <OrderIcon {...order} column="tauxDevenirFavorableRegional" />
        {CORRECTIONS_COLUMNS.tauxDevenirFavorableRegional}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"tauxPressionRegional"}
        onClick={handleOrder}
        textAlign="center"
        bgColor={getCellColor("tauxPressionRegional")}
        icon={<TooltipDefinitionTauxDePression />}
      >
        <OrderIcon {...order} column="tauxPressionRegional" />
        {CORRECTIONS_COLUMNS.tauxPressionRegional}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"nbEtablissement"}
        onClick={handleOrder}
        isNumeric
        minW={200}
        maxW={200}
        bgColor={getCellColor("nbEtablissement")}
        icon={<TooltipIcon ml="1" label="Le nombre d'établissement dispensant la formation dans la région." />}
      >
        <OrderIcon {...order} column="nbEtablissement" />
        {CORRECTIONS_COLUMNS.nbEtablissement}
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
