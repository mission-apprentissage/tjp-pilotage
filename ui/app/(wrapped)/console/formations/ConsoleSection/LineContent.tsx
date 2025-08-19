import { ArrowForwardIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Box, chakra, Flex, IconButton, Link, Skeleton, Td, Text, Tooltip, Tr } from "@chakra-ui/react";
import NextLink from "next/link";
import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from "shared";
import { getMillesimeFromRentreeScolaire } from "shared/utils/getMillesime";

import { FORMATION_COLUMNS } from "@/app/(wrapped)/console/formations/FORMATION_COLUMNS";
import type { Filters , Formation  } from "@/app/(wrapped)/console/formations/types";
import { getEvolutionEffectifData, getEvolutionTauxEntreeData, getEvolutionTauxSortieData } from "@/app/(wrapped)/console/utils/extractEvolutionData";
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
import { getTauxDemandeStyle,getTauxPressionStyle } from "@/utils/getBgScale";


const ConditionalTd = chakra(
  ({
    className,
    colonneFilters,
    colonne,
    getCellBgColor,
    children,
    isNumeric = false,
  }: {
    className?: string;
    colonneFilters: (keyof typeof FORMATION_COLUMNS)[];
    colonne: keyof typeof FORMATION_COLUMNS;
    getCellBgColor: (column: keyof typeof FORMATION_COLUMNS) => string;
    children: React.ReactNode;
    isNumeric?: boolean;
  }) => {
    if (colonneFilters.includes(colonne))
      return (
        <Td
          className={className}
          isNumeric={isNumeric}
          whiteSpace={"normal"}
          _groupHover={{ bgColor: "blueecume.850 !important" }}
          bgColor={getCellBgColor(colonne)}
        >
          {children}
        </Td>
      );
    return null;
  }
);

export const FormationLineContent = ({
  formation,
  onClickExpend,
  onClickCollapse,
  expended = false,
  canShowQuadrantPosition,
  isSticky,
  filters,
  colonneFilters,
  getCellBgColor,
}: {
  formation: Partial<Formation>;
  onClickExpend?: () => void;
  onClickCollapse?: () => void;
  expended?: boolean;
  canShowQuadrantPosition?: boolean;
  isSticky?: boolean;
  filters?: Partial<Filters>;
  colonneFilters: (keyof typeof FORMATION_COLUMNS)[];
  getCellBgColor: (column: keyof typeof FORMATION_COLUMNS) => string;
}) => (
  <>
    <Td pr="0" py="1" _groupHover={{ bgColor: "blueecume.850 !important" }}>
      {onClickExpend && (
        <IconButton
          transform={expended ? "rotate(180deg)" : ""}
          variant="ghost"
          onClick={() => (!expended ? onClickExpend() : onClickCollapse?.())}
          size="xs"
          aria-label="Afficher l'historique"
          icon={<ChevronDownIcon />}
        />
      )}
      {!onClickExpend && (
        <Box as="span" opacity={0.3} fontWeight="bold">
          &nbsp;&nbsp;└─
        </Box>
      )}
    </Td>
    <ConditionalTd colonne={"rentreeScolaire"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {formation.rentreeScolaire ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne={"libelleDispositif"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {formation.libelleDispositif ?? "-"}
    </ConditionalTd>
    <ConditionalTd
      colonne={"libelleFormation"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      minW={450}
      whiteSpace={"normal"}
      left={0}
      zIndex={1}
      position={{ lg: "relative", xl: "sticky" }}
      boxShadow={{
        lg: "none",
        xl: isSticky ? "inset -2px 0px 0px 0px #E2E8F0" : "none",
      }}
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
    <ConditionalTd colonne={"formationSpecifique"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      <BadgesFormationSpecifique
        formationSpecifique={formation.formationSpecifique}
        labelSize="long"
        size="sm"
      />
    </ConditionalTd>
    <ConditionalTd colonne={"libelleNiveauDiplome"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {formation.libelleNiveauDiplome ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne={"libelleFamille"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {formation.libelleFamille ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne={"cfd"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {formation.cfd ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne={"cpc"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {formation.cpc ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne={"cpcSecteur"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {formation.cpcSecteur ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne={"libelleNsf"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {formation.libelleNsf ?? "-"}
    </ConditionalTd>
    <ConditionalTd
      colonne={"nbEtablissement"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
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
    <ConditionalTd colonne={"evolutionEffectif"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} p={0}>
      <GraphEvolution
        title={FORMATION_COLUMNS.evolutionTauxPression}
        data={getEvolutionEffectifData(formation)}
      />
    </ConditionalTd>
    <ConditionalTd colonne={"effectif1"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} isNumeric>
      {formation.effectif1 ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne={"effectif2"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} isNumeric>
      {formation.effectif2 ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne={"effectif3"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} isNumeric>
      {formation.effectif3 ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne={"effectifEntree"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} isNumeric>
      {formation.effectifEntree ?? "-"}
    </ConditionalTd>
    <ConditionalTd
      colonne={"tauxPression"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      textAlign={"center"}
    >
      <TableBadge sx={
        getTauxPressionStyle(formation.tauxPression !== undefined ? formatNumber(formation.tauxPression, 2) : undefined)
      }>
        {formatNumberToString(formation.tauxPression, 2, "-")}
      </TableBadge>
    </ConditionalTd>
    <ConditionalTd colonne={"evolutionTauxPression"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} p={0}>
      <GraphEvolution
        title={FORMATION_COLUMNS.evolutionTauxPression}
        data={getEvolutionTauxEntreeData({ evolutions: formation.evolutionTauxEntree, taux: "tauxPression"})}
        isPercentage={false}
      />
    </ConditionalTd>
    <ConditionalTd
      colonne={"tauxDemande"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      textAlign={"center"}
    >
      <TableBadge sx={
        getTauxDemandeStyle(formation.tauxDemande !== undefined ? formatNumber(formation.tauxDemande, 2) : undefined)
      }>
        {formatNumberToString(formation.tauxDemande, 2, "-")}
      </TableBadge>
    </ConditionalTd>
    <ConditionalTd colonne={"evolutionTauxDemande"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} p={0}>
      <GraphEvolution
        title={FORMATION_COLUMNS.evolutionTauxDemande}
        data={getEvolutionTauxEntreeData({ evolutions: formation.evolutionTauxEntree, taux: "tauxDemande"})}
        isPercentage={false}
      />
    </ConditionalTd>
    <ConditionalTd
      colonne={"tauxRemplissage"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      textAlign={"center"}
    >
      <GraphWrapper value={formation.tauxRemplissage} />
    </ConditionalTd>
    <ConditionalTd colonne={"evolutionTauxRemplissage"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} p={0}>
      <GraphEvolution
        title={FORMATION_COLUMNS.evolutionTauxRemplissage}
        data={getEvolutionTauxEntreeData({ evolutions: formation.evolutionTauxEntree, taux: "tauxRemplissage"})}
        isPercentage={true}
      />
    </ConditionalTd>
    {canShowQuadrantPosition && (
      <ConditionalTd
        colonne={"positionQuadrant"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        textAlign={"center"}
      >
        <Tooltip
          label={`Position dans le quadrant (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`}
          placement="top"
        >
          {formation.positionQuadrant ?? "-"}
        </Tooltip>
      </ConditionalTd>
    )}
    <ConditionalTd colonne={"tauxDevenirFavorable"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      <GraphWrapper continuum={formation.continuum} value={formation.tauxDevenirFavorable} millesime={CURRENT_IJ_MILLESIME} my="auto" />
    </ConditionalTd>
    <ConditionalTd colonne={"evolutionTauxDevenirFavorable"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} p={0}>
      <GraphEvolution
        title={FORMATION_COLUMNS.evolutionTauxDevenirFavorable}
        data={getEvolutionTauxSortieData({ evolutions: formation.evolutionTauxSortie, taux: "tauxDevenirFavorable"})}
        isPercentage={true}
      />
    </ConditionalTd>
    <ConditionalTd
      colonne={"tauxInsertion"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      textAlign={"center"}
    >
      <GraphWrapper
        continuum={formation.continuum}
        value={formation.tauxInsertion}
        millesime={getMillesimeFromRentreeScolaire({ rentreeScolaire: formation.rentreeScolaire ?? CURRENT_RENTREE })}
      />
    </ConditionalTd>
    <ConditionalTd colonne={"evolutionTauxInsertion"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} p={0}>
      <GraphEvolution
        title={FORMATION_COLUMNS.tauxInsertion}
        data={getEvolutionTauxSortieData({ evolutions: formation.evolutionTauxSortie, taux: "tauxInsertion"})}
        isPercentage={true}
      />
    </ConditionalTd>
    <ConditionalTd
      colonne={"tauxPoursuite"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      textAlign={"center"}
    >
      <GraphWrapper
        continuum={formation.continuum}
        value={formation.tauxPoursuite}
        millesime={getMillesimeFromRentreeScolaire({ rentreeScolaire: formation.rentreeScolaire ?? CURRENT_RENTREE })}
      />
    </ConditionalTd>
    <ConditionalTd colonne={"evolutionTauxPoursuite"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} p={0}>
      <GraphEvolution
        title={FORMATION_COLUMNS.evolutionTauxPoursuite}
        data={getEvolutionTauxSortieData({ evolutions: formation.evolutionTauxSortie, taux: "tauxPoursuite"})}
        isPercentage={true}
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
  getCellBgColor,
}: {
  colonneFilters: (keyof typeof FORMATION_COLUMNS)[];
  getCellBgColor: (column: keyof typeof FORMATION_COLUMNS) => string;
}) => (
  <Tr bg={"grey.975"}>
    <FormationLineContent formation={{}} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} />
  </Tr>
);
