import { ArrowForwardIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Box, chakra, Flex, IconButton, Link, Skeleton, Tag, Td, Text, Tr } from "@chakra-ui/react";
import NextLink from "next/link";

import type { FORMATION_COLUMNS } from "@/app/(wrapped)/console/formations/FORMATION_COLUMNS";
import type { Filters, Line } from "@/app/(wrapped)/console/formations/types";
import { BadgeFormationRenovee } from "@/components/BadgeFormationRenovee";
import { BadgesFormationSpecifique } from "@/components/BadgesFormationSpecifique";
import { GraphWrapper } from "@/components/GraphWrapper";
import { TableBadge } from "@/components/TableBadge";
import { createParameterizedUrl } from "@/utils/createParameterizedUrl";
import { formatAnneeCommuneLibelle } from "@/utils/formatLibelle";
import { formatNumber } from "@/utils/formatUtils";
import { getTauxPressionStyle } from "@/utils/getBgScale";

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
  line,
  onClickExpend,
  onClickCollapse,
  expended = false,
  canShowQuadrantPosition,
  isSticky,
  filters,
  colonneFilters,
  getCellBgColor,
}: {
  line: Partial<Line>;
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
      {line.rentreeScolaire ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne={"libelleDispositif"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {line.libelleDispositif ?? "-"}
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
        <Flex w={"fit-content"} my={"auto"}>
          {formatAnneeCommuneLibelle(line, "long", "sm", "12px")}
        </Flex>
        <BadgeFormationRenovee isFormationRenovee={!!line.isFormationRenovee} ms={2}/>
        {line.formationRenovee && (
          <Flex ms={2} my={"auto"} width={"fit-content"} h={"1.8rem"} whiteSpace={"nowrap"} direction={"column"}>
            {line.dateFermeture && (
              <Tag size="sm" bgColor="grey.1000_active" color={"grey.425"} width={"fit-content"} fontSize={12}>
                Fermeture au {line.dateFermeture}
              </Tag>
            )}
            <Link
              variant="text"
              as={NextLink}
              href={createParameterizedUrl("/console/formations", {
                filters: {
                  cfd: [line.formationRenovee],
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
      <BadgesFormationSpecifique formationSpecifique={line.formationSpecifique} />
    </ConditionalTd>
    <ConditionalTd colonne={"libelleNiveauDiplome"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {line.libelleNiveauDiplome ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne={"libelleFamille"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {line.libelleFamille ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne={"cfd"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {line.cfd ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne={"cpc"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {line.cpc ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne={"cpcSecteur"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {line.cpcSecteur ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne={"libelleNsf"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {line.libelleNsf ?? "-"}
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
            cfd: [line.cfd],
            codeDispositif: line.codeDispositif ? [line.codeDispositif] : undefined,
          },
        })}
        aria-label={`Voir les établissements pour le CFD ${line.cfd} et le code dispositif ${line.codeDispositif}`}
      >
        {line.nbEtablissement ?? "-"}
      </Link>
    </ConditionalTd>
    <ConditionalTd colonne={"effectif1"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} isNumeric>
      {line.effectif1 ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne={"effectif2"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} isNumeric>
      {line.effectif2 ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne={"effectif3"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} isNumeric>
      {line.effectif3 ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne={"effectifEntree"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} isNumeric>
      {line.effectifEntree ?? "-"}
    </ConditionalTd>
    <ConditionalTd
      colonne={"tauxPression"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      textAlign={"center"}
    >
      <TableBadge
        sx={getTauxPressionStyle(line.tauxPression !== undefined ? formatNumber(line.tauxPression, 2) : undefined)}
      >
        {line.tauxPression !== undefined ? formatNumber(line.tauxPression, 2) : "-"}
      </TableBadge>
    </ConditionalTd>
    <ConditionalTd
      colonne={"tauxRemplissage"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      textAlign={"center"}
    >
      <GraphWrapper value={line.tauxRemplissage} />
    </ConditionalTd>
    {canShowQuadrantPosition && (
      <ConditionalTd
        colonne={"positionQuadrant"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        textAlign={"center"}
      >
        {line.positionQuadrant ?? "-"}
      </ConditionalTd>
    )}
    <ConditionalTd
      colonne={"tauxInsertion"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      textAlign={"center"}
    >
      <GraphWrapper continuum={line.continuum} value={line.tauxInsertion} />
    </ConditionalTd>
    <ConditionalTd
      colonne={"tauxPoursuite"}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      textAlign={"center"}
    >
      <GraphWrapper continuum={line.continuum} value={line.tauxPoursuite} />
    </ConditionalTd>
    <ConditionalTd colonne={"tauxDevenirFavorable"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      <GraphWrapper continuum={line.continuum} value={line.tauxDevenirFavorable} my="auto" />
    </ConditionalTd>
  </>
);

export const FormationLineLoader = () => (
  <Tr bg={"grey.975"}>
    {new Array(17).fill(0).map((_, i) => (
      <Td key={i}>
        <Skeleton opacity={0.3} height="16px" />
      </Td>
    ))}
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
    <FormationLineContent line={{}} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} />
  </Tr>
);
