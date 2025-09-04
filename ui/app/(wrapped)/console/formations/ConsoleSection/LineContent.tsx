import { ArrowForwardIcon } from "@chakra-ui/icons";
import { chakra, Flex, Link, Skeleton, Td, Text, Tooltip, Tr } from "@chakra-ui/react";
import NextLink from "next/link";
import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from "shared";
import { getMillesimeFromRentreeScolaire } from "shared/utils/getMillesime";

import { FORMATION_COLUMNS } from "@/app/(wrapped)/console/formations/FORMATION_COLUMNS";
import type { Filters, Formation, FORMATION_COLUMNS_KEYS } from "@/app/(wrapped)/console/formations/types";
import { getEvolutionIcon, getEvolutionTauxEntreeData, getEvolutionTauxEntreeKeys, getEvolutionTauxSortieData, getEvolutionTauxSortieKeys } from "@/app/(wrapped)/console/utils/extractEvolutionData";
import { BadgeFermeture } from "@/components/BadgeFermeture";
import { BadgeFormationRenovee } from "@/components/BadgeFormationRenovee";
import { BadgesFormationSpecifique } from "@/components/BadgesFormationSpecifique";
import {BadgeTypeFamille} from '@/components/BadgeTypeFamille';
import { GraphEvolution } from "@/components/GraphEvolution";
import { GraphWrapper } from "@/components/GraphWrapper";
import { TableBadge } from "@/components/TableBadge";
import { createParameterizedUrl } from "@/utils/createParameterizedUrl";
import { formatFamilleMetierLibelle, formatMillesime } from "@/utils/formatLibelle";
import { formatNumber, formatNumberToString } from "@/utils/formatUtils";
import {getTauxPressionStyle } from "@/utils/getBgScale";

import { getLeftOffset, isColonneSticky, isColonneVisible  } from "./utils";

const ConditionalTd = chakra(
  ({
    className,
    colonneFilters,
    colonne,
    stickyColonnes,
    getCellBgColor,
    children,
    isNumeric = false,
  }: {
    className?: string;
    colonneFilters: (keyof typeof FORMATION_COLUMNS)[];
    colonne: keyof typeof FORMATION_COLUMNS;
    stickyColonnes: FORMATION_COLUMNS_KEYS[];
    getCellBgColor: (column: keyof typeof FORMATION_COLUMNS) => string;
    children: React.ReactNode;
    isNumeric?: boolean;
  }) => {
    const isVisible = isColonneVisible({ colonne, colonneFilters });
    const isSticky = isColonneSticky({ colonne, stickyColonnes });
    if (isVisible)
      return (
        <Td
          className={className}
          isNumeric={isNumeric}
          whiteSpace={"normal"}
          _groupHover={{ bgColor: "blueecume.850 !important" }}
          bgColor={getCellBgColor(colonne)}
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
          {children}
        </Td>
      );
    return null;
  }
);

export const FormationLineContent = ({
  formation,
  canShowQuadrantPosition,
  filters,
  colonneFilters,
  stickyColonnes,
  getCellBgColor,
}: {
  formation: Partial<Formation>;
  canShowQuadrantPosition?: boolean;
  filters?: Partial<Filters>;
  colonneFilters: (keyof typeof FORMATION_COLUMNS)[];
  stickyColonnes: FORMATION_COLUMNS_KEYS[];
  getCellBgColor: (column: keyof typeof FORMATION_COLUMNS) => string;
}) => (
  <>
    <ConditionalTd
      colonne={"rentreeScolaire"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
    >
      {formation.rentreeScolaire ?? "-"}
    </ConditionalTd>
    <ConditionalTd
      colonne={"libelleDispositif"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
    >
      {formation.libelleDispositif ?? "-"}
    </ConditionalTd>
    <ConditionalTd
      colonne={"libelleFormation"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
      whiteSpace={"normal"}
    >
      <Flex>
        {formatFamilleMetierLibelle({ formation, labelSize: "long", size: "sm", fontSize: "12px", withBadge: false })}
        <BadgeTypeFamille
          typeFamille={formation.typeFamille}
          labelSize="long"
          size="sm"
          ms={2}
        />
        <BadgeFormationRenovee
          isFormationRenovee={formation.isFormationRenovee}
          labelSize="long"
          size="sm"
          ms={2}
        />
        {formation.formationRenovee && (
          <Flex my={"auto"} width={"fit-content"} h={"1.8rem"} whiteSpace={"nowrap"} direction={"column"}>
            <BadgeFermeture
              dateFermeture={formation.dateFermeture}
              labelSize="long"
              size="sm"
              ms={2}
            />
            <Link
              variant="text"
              as={NextLink}
              href={createParameterizedUrl("/console/formations", {
                filters: {
                  cfd: [formation.formationRenovee],
                },
              })}
              color="bluefrance.113"
            >
              <Flex my="auto">
                <Text fontSize={12}>Voir la formation rénovée</Text>
                <ArrowForwardIcon ml={1} boxSize={"14px"} verticalAlign={"baseline"} />
              </Flex>
            </Link>
          </Flex>
        )}
      </Flex>
    </ConditionalTd>
    <ConditionalTd
      colonne={"formationSpecifique"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
    >
      <BadgesFormationSpecifique
        formationSpecifique={formation.formationSpecifique}
        labelSize="long"
        size="sm"
      />
    </ConditionalTd>
    <ConditionalTd
      colonne={"libelleNiveauDiplome"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
    >
      {formation.libelleNiveauDiplome ?? "-"}
    </ConditionalTd>
    <ConditionalTd
      colonne={"libelleFamille"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
    >
      {formation.libelleFamille ?? "-"}
    </ConditionalTd>
    <ConditionalTd
      colonne={"cfd"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
    >
      {formation.cfd ?? "-"}
    </ConditionalTd>
    <ConditionalTd
      colonne={"cpc"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
    >
      {formation.cpc ?? "-"}
    </ConditionalTd>
    <ConditionalTd
      colonne={"cpcSecteur"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
    >
      {formation.cpcSecteur ?? "-"}
    </ConditionalTd>
    <ConditionalTd
      colonne={"libelleNsf"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
    >
      {formation.libelleNsf ?? "-"}
    </ConditionalTd>
    <ConditionalTd
      colonne={"nbEtablissement"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
      isNumeric
    >
      <Link
        variant="text"
        as={NextLink}
        href={createParameterizedUrl("/console/etablissements", {
          filters: {
            ...filters,
            cfd: [formation.cfd],
            codeDispositif: formation.codeDispositif ? [formation.codeDispositif] : undefined,
          },
        })}
      >
        {formation.nbEtablissement ?? "-"}
      </Link>
    </ConditionalTd>
    <ConditionalTd
      colonne={"effectif1"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
      isNumeric
    >
      {formation.effectif1 ?? "-"}
    </ConditionalTd>
    <ConditionalTd
      colonne={"effectif2"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
      isNumeric
    >
      {formation.effectif2 ?? "-"}
    </ConditionalTd>
    <ConditionalTd
      colonne={"effectif3"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
      isNumeric
    >
      {formation.effectif3 ?? "-"}
    </ConditionalTd>
    <ConditionalTd
      colonne={"effectifEntree"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
      isNumeric
    >
      <Flex gap={1} justify={"end"}>
        {formation.effectifEntree ?? "-"}
        {getEvolutionIcon({ data: getEvolutionTauxEntreeData({ evolutions: formation.evolutionTauxEntree, key: "effectif"}) })}
      </Flex>
    </ConditionalTd>
    <ConditionalTd
      colonne={"evolutionEffectif"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
      p={0}
    >
      <GraphEvolution
        title={FORMATION_COLUMNS.evolutionTauxPression}
        data={getEvolutionTauxEntreeData({ evolutions: formation.evolutionTauxEntree, key: "effectif"})}
        keys={getEvolutionTauxEntreeKeys({ rentreeScolaire: filters?.rentreeScolaire })}
      />
    </ConditionalTd>
    <ConditionalTd
      colonne={"tauxPression"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
      textAlign={"center"}
    >
      <Flex gap={1} justify={"end"}>
        <TableBadge sx={
          getTauxPressionStyle(formation.tauxPression !== undefined ? formatNumber(formation.tauxPression, 2) : undefined)
        }>
          {formatNumberToString(formation.tauxPression, 2, "-")}
        </TableBadge>
        {getEvolutionIcon({ data: getEvolutionTauxEntreeData({ evolutions: formation.evolutionTauxEntree, key: "tauxPression"}) })}
      </Flex>
    </ConditionalTd>
    <ConditionalTd
      colonne={"evolutionTauxPression"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
      p={0}
    >
      <GraphEvolution
        title={FORMATION_COLUMNS.evolutionTauxPression}
        data={getEvolutionTauxEntreeData({ evolutions: formation.evolutionTauxEntree, key: "tauxPression"})}
        isPercentage={false}
        keys={getEvolutionTauxEntreeKeys({ rentreeScolaire: filters?.rentreeScolaire })}
      />
    </ConditionalTd>
    <ConditionalTd
      colonne={"tauxDemande"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
      textAlign={"center"}
    >
      <Flex gap={1} justify={"end"}>
        <TableBadge sx={
          getTauxPressionStyle(formation.tauxDemande !== undefined ? formatNumber(formation.tauxDemande, 2) : undefined)
        }>
          {formatNumberToString(formation.tauxDemande, 2, "-")}
        </TableBadge>
        {getEvolutionIcon({ data: getEvolutionTauxEntreeData({ evolutions: formation.evolutionTauxEntree, key: "tauxDemande"}) })}
      </Flex>
    </ConditionalTd>
    <ConditionalTd
      colonne={"evolutionTauxDemande"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
      p={0}
    >
      <GraphEvolution
        title={FORMATION_COLUMNS.evolutionTauxDemande}
        data={getEvolutionTauxEntreeData({ evolutions: formation.evolutionTauxEntree, key: "tauxDemande"})}
        isPercentage={false}
        keys={getEvolutionTauxEntreeKeys({ rentreeScolaire: filters?.rentreeScolaire })}
      />
    </ConditionalTd>
    <ConditionalTd
      colonne={"tauxRemplissage"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
      textAlign={"center"}
    >
      <Flex gap={1} justify={"end"}>
        <GraphWrapper value={formation.tauxRemplissage} />
        {getEvolutionIcon({ data: getEvolutionTauxEntreeData({ evolutions: formation.evolutionTauxEntree, key: "tauxRemplissage"}) })}
      </Flex>
    </ConditionalTd>
    <ConditionalTd
      colonne={"evolutionTauxRemplissage"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
      p={0}
    >
      <GraphEvolution
        title={FORMATION_COLUMNS.evolutionTauxRemplissage}
        data={getEvolutionTauxEntreeData({ evolutions: formation.evolutionTauxEntree, key: "tauxRemplissage"})}
        isPercentage={true}
        keys={getEvolutionTauxEntreeKeys({ rentreeScolaire: filters?.rentreeScolaire })}
      />
    </ConditionalTd>
    {canShowQuadrantPosition && (
      <>
        <ConditionalTd
          colonne={"positionQuadrant"}
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          textAlign={"center"}
        >
          <Tooltip
            label={`Position dans le quadrant (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`}
            placement="top"
          >
            {formation.positionQuadrant ?? "-"}
          </Tooltip>
        </ConditionalTd>
        {/* <ConditionalTd
          colonne="evolutionPositionQuadrant"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          stickyColonnes={stickyColonnes}
          textAlign={"center"}
        >
          {
            isHistorique ? (
              "-"
            ) : (
              <TableEvolution
                data={getEvolutionPositionQuadrantData({ evolutions: formation.evolutionPositionQuadrant })}
                isPercentage={true}
                keys={getEvolutionTauxSortieKeys({ rentreeScolaire: filters?.rentreeScolaire })}
              />
            )
          }
        </ConditionalTd> */}
      </>
    )}
    <ConditionalTd
      colonne={"tauxDevenirFavorable"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
    >
      <Flex gap={1} justify={"end"}>
        <GraphWrapper
          continuum={formation.continuum}
          value={formation.tauxDevenirFavorable}
          millesime={getMillesimeFromRentreeScolaire({ rentreeScolaire: formation.rentreeScolaire ?? CURRENT_RENTREE })}
        />
        {getEvolutionIcon({ data: getEvolutionTauxSortieData({ evolutions: formation.evolutionTauxSortie, key: "tauxDevenirFavorable"}) })}
      </Flex>
    </ConditionalTd>
    <ConditionalTd
      colonne={"evolutionTauxDevenirFavorable"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
      p={0}
    >
      <GraphEvolution
        title={FORMATION_COLUMNS.evolutionTauxDevenirFavorable}
        data={getEvolutionTauxSortieData({ evolutions: formation.evolutionTauxSortie, key: "tauxDevenirFavorable"})}
        isPercentage={true}
        keys={getEvolutionTauxSortieKeys({ rentreeScolaire: filters?.rentreeScolaire })}
      />
    </ConditionalTd>
    <ConditionalTd
      colonne={"tauxInsertion"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
      textAlign={"center"}
    >
      <Flex gap={1} justify={"end"}>
        <GraphWrapper
          continuum={formation.continuum}
          value={formation.tauxInsertion}
          millesime={getMillesimeFromRentreeScolaire({ rentreeScolaire: formation.rentreeScolaire ?? CURRENT_RENTREE })}
        />
        {getEvolutionIcon({ data: getEvolutionTauxSortieData({ evolutions: formation.evolutionTauxSortie, key: "tauxInsertion"}) })}
      </Flex>
    </ConditionalTd>
    <ConditionalTd
      colonne={"evolutionTauxInsertion"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
      p={0}
    >
      <GraphEvolution
        title={FORMATION_COLUMNS.evolutionTauxInsertion}
        data={getEvolutionTauxSortieData({ evolutions: formation.evolutionTauxSortie, key: "tauxInsertion"})}
        isPercentage={true}
        keys={getEvolutionTauxSortieKeys({ rentreeScolaire: filters?.rentreeScolaire })}
      />
    </ConditionalTd>
    <ConditionalTd
      colonne={"tauxPoursuite"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
      textAlign={"center"}
    >
      <Flex gap={1} justify={"end"}>
        <GraphWrapper
          continuum={formation.continuum}
          value={formation.tauxPoursuite}
          millesime={getMillesimeFromRentreeScolaire({ rentreeScolaire: formation.rentreeScolaire ?? CURRENT_RENTREE })}
        />
        {getEvolutionIcon({ data: getEvolutionTauxSortieData({ evolutions: formation.evolutionTauxSortie, key: "tauxPoursuite"}) })}
      </Flex>
    </ConditionalTd>
    <ConditionalTd
      colonne={"evolutionTauxPoursuite"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      stickyColonnes={stickyColonnes}
      p={0}
    >
      <GraphEvolution
        title={FORMATION_COLUMNS.evolutionTauxPoursuite}
        data={getEvolutionTauxSortieData({ evolutions: formation.evolutionTauxSortie, key: "tauxPoursuite"})}
        isPercentage={true}
        keys={getEvolutionTauxSortieKeys({ rentreeScolaire: filters?.rentreeScolaire })}
      />
    </ConditionalTd>
  </>
);

export const FormationLineLoader = () => (
  <Tr bg={"grey.975"}>
    {new Array(17).fill(0).map((_, i) => {
      const key = `loader_FormationLine_${i}`;
      return (
        <Td key={key}>
          <Skeleton opacity={0.3} height="16px" />
        </Td>
      );}
    )}
  </Tr>
);

export const FormationLinePlaceholder = ({
  colonneFilters,
  stickyColonnes,
  getCellBgColor,
}: {
  colonneFilters: (keyof typeof FORMATION_COLUMNS)[];
  stickyColonnes: FORMATION_COLUMNS_KEYS[];
  getCellBgColor: (column: keyof typeof FORMATION_COLUMNS) => string;
}) => (
  <Tr bg={"grey.975"}>
    <FormationLineContent
      formation={{}}
      stickyColonnes={stickyColonnes}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
    />
  </Tr>
);
