import { ArrowForwardIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Box, chakra, Flex, IconButton,Link, Skeleton, Td, Text, Tooltip, Tr } from "@chakra-ui/react";
import NextLink from "next/link";
import { Fragment } from "react";
import { CURRENT_IJ_MILLESIME } from "shared";
import type { UserType } from "shared/schema/userSchema";
import { getMillesimeFromRentreeScolaire } from "shared/utils/getMillesime";

import { ETABLISSEMENT_COLUMN_WIDTH } from "@/app/(wrapped)/console/etablissements/ETABLISSEMENT_COLUMN_WIDTH";
import type { FORMATION_ETABLISSEMENT_COLUMNS_KEYS,Line } from "@/app/(wrapped)/console/etablissements/types";
import { BadgeFermeture } from "@/components/BadgeFermeture";
import { BadgeFormationRenovee } from "@/components/BadgeFormationRenovee";
import { BadgesFormationSpecifique } from "@/components/BadgesFormationSpecifique";
import { BadgeTypeDemande } from "@/components/BadgeTypeDemande";
import { BadgeTypeFamille } from "@/components/BadgeTypeFamille";
import { DateEffetTransformationComponent } from "@/components/DateEffetTransformationComponent";
import { GraphWrapper } from "@/components/GraphWrapper";
import { TableBadge } from "@/components/TableBadge";
import { createParameterizedUrl } from "@/utils/createParameterizedUrl";
import { feature } from "@/utils/feature";
import { formatCodeDepartement,formatFamilleMetierLibelle , formatMillesime} from "@/utils/formatLibelle";
import { formatNumber, formatNumberToString } from "@/utils/formatUtils";
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
    colonneFilters: (FORMATION_ETABLISSEMENT_COLUMNS_KEYS)[];
    colonne: FORMATION_ETABLISSEMENT_COLUMNS_KEYS;
    getCellBgColor: (column: FORMATION_ETABLISSEMENT_COLUMNS_KEYS) => string;
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

export const EtablissementLineContent = ({
  onClickExpend,
  onClickCollapse,
  expended,
  line,
  isFirstColumnSticky,
  isSecondColumnSticky,
  colonneFilters,
  getCellBgColor,
  user,
}: {
  onClickExpend?: () => void;
  onClickCollapse?: () => void;
  expended?: boolean;
  line: Partial<Line>;
  isFirstColumnSticky?: boolean;
  isSecondColumnSticky?: boolean;
  colonneFilters: FORMATION_ETABLISSEMENT_COLUMNS_KEYS[];
  getCellBgColor: (column: FORMATION_ETABLISSEMENT_COLUMNS_KEYS) => string;
  user?: UserType;
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
    <ConditionalTd colonne="rentreeScolaire" colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {line.rentreeScolaire ?? "-"}
    </ConditionalTd>
    <ConditionalTd
      colonne="libelleEtablissement"
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      minW={ETABLISSEMENT_COLUMN_WIDTH}
      maxW={ETABLISSEMENT_COLUMN_WIDTH}
      whiteSpace="normal"
      left={0}
      zIndex={1}
      position={{ lg: "relative", xl: "sticky" }}
      boxShadow={{
        lg: "none",
        xl: isFirstColumnSticky ? "inset -2px 0px 0px 0px #E2E8F0" : "none",
      }}
    >
      <Link
        as={NextLink}
        href={`/panorama/etablissement/${line.uai}`}
        target="_blank"
        fontWeight={400}
        _hover={{
          textDecoration: "underline",
        }}
        color={"bluefrance.113"}
      >
        <Flex justify={"start"}>{line.libelleEtablissement ?? "-"}</Flex>
      </Link>
    </ConditionalTd>
    <ConditionalTd
      colonne="commune"
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      minW={150}
      maxW={150}
      whiteSpace="normal"
    >
      {line.commune ? `${line.commune} (${formatCodeDepartement(line.codeDepartement)})` : "-"}
    </ConditionalTd>
    <ConditionalTd colonne="libelleDepartement" colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {line.libelleDepartement ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne="libelleAcademie" colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {line.libelleAcademie ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne="libelleRegion" colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {line.libelleRegion ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne="secteur" colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {line.secteur ?? "-"}{" "}
    </ConditionalTd>
    <ConditionalTd colonne="uai" colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {line.uai ?? "-"}{" "}
    </ConditionalTd>
    <ConditionalTd colonne="libelleDispositif" colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {line.libelleDispositif ?? "-"}
    </ConditionalTd>
    <ConditionalTd
      colonne="libelleFormation"
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      minW={450}
      whiteSpace="normal"
      zIndex={1}
      position={{ lg: "relative", xl: "sticky" }}
      left={{ lg: "unset", xl: ETABLISSEMENT_COLUMN_WIDTH - 1 }}
      boxShadow={{
        lg: "none",
        xl: isSecondColumnSticky ? "inset -2px 0px 0px 0px #E2E8F0" : "none",
      }}
    >
      <Flex>
        {formatFamilleMetierLibelle({ formation: line, labelSize: "long", size: "sm", fontSize: "12px", withBadge: false })}
        <BadgeTypeFamille
          typeFamille={line.typeFamille}
          labelSize="long"
          size="sm"
          ms={2}
        />
        <BadgeFormationRenovee
          isFormationRenovee={!!line.isFormationRenovee}
          labelSize="long"
          size="sm"
          ms={2}
        />
        {line.formationRenovee && (
          <Flex my={"auto"} width={"fit-content"} h={"1.8rem"} whiteSpace={"nowrap"} direction={"column"}>
            <BadgeFermeture
              dateFermeture={line.dateFermeture}
              labelSize="long"
              size="sm"
              ms={2}
            />
            <Link
              variant="text"
              as={NextLink}
              href={createParameterizedUrl("/console/etablissements", {
                filters: {
                  cfd: line.formationRenovee.split(", "),
                  rentreeScolaire: line.rentreeScolaire,
                },
              })}
              color="bluefrance.113"
            >
              <Flex my="auto">
                <Text fontSize={12}>
                  Voir {line.formationRenovee.split(", ").length > 1 ? "les formations rénovées" :"la formation rénovée"}
                </Text>
                <ArrowForwardIcon ml={1} boxSize={"14px"} verticalAlign={"baseline"} />
              </Flex>
            </Link>
          </Flex>
        )}
      </Flex>
    </ConditionalTd>
    <ConditionalTd colonne={"formationSpecifique"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      <BadgesFormationSpecifique
        formationSpecifique={line.formationSpecifique}
        labelSize="long"
        size="sm"
      />
    </ConditionalTd>
    <ConditionalTd colonne="libelleNiveauDiplome" colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {line.libelleNiveauDiplome ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne="libelleFamille" colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {line.libelleFamille ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne="cfd" colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {line.cfd ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne="cpc" colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {line.cpc ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne="cpcSecteur" colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {line.cpcSecteur ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne="libelleNsf" colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      {line.libelleNsf ?? "-"}
    </ConditionalTd>
    {feature.donneesTransfoConsole && user && (
      <>
        <ConditionalTd
          colonne="numero"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          textAlign="center"
        >
          {line.numero?.split(", ").map((numero, index, numeros) => (
            <Fragment key={numero + index}>
              <Link
                key={numero + index}
                as={NextLink}
                href={`/demandes/synthese/${numero}`}
                target="_blank"
                color="bluefrance.113"
              >
                {numero}
              </Link>
              {index < (numeros.length -1) && <Text as="span">, </Text>}
            </Fragment>
          ))}
        </ConditionalTd>
        <ConditionalTd
          colonne="dateEffetTransformation"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          textAlign="center"
          justifyContent="center"
        >
          <DateEffetTransformationComponent
            dateEffetTransformation={line.dateEffetTransformation}
            typeDemande={line.typeDemande}
            rentreeScolaire={line.rentreeScolaire}
          />
        </ConditionalTd>
        <ConditionalTd
          colonne="typeDemande"
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          textAlign="center"
        >
          <BadgeTypeDemande
            typeDemande={line.typeDemande}
            numero={line.numero}
            dateEffetTransformation={line.dateEffetTransformation}
            anneeCampagne={line.anneeCampagne}
          />
        </ConditionalTd>
      </>
    )}
    <ConditionalTd colonne="effectif1" colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} isNumeric>
      {line.effectif1 ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne="effectif2" colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} isNumeric>
      {line.effectif2 ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne="effectif3" colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} isNumeric>
      {line.effectif3 ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne="effectifEntree" colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} isNumeric>
      {line.effectifEntree ?? "-"}
    </ConditionalTd>
    <ConditionalTd colonne="capacite" colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} isNumeric>
      {line.capacite ?? "-"}
    </ConditionalTd>
    <ConditionalTd
      colonne="tauxPression"
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      textAlign={"center"}
    >
      <TableBadge sx={
        getTauxPressionStyle(line.tauxPression !== undefined ? formatNumber(line.tauxPression, 2) : undefined)
      }>
        {formatNumberToString(line.tauxPression, 2, "-")}
      </TableBadge>
    </ConditionalTd>
    <ConditionalTd
      colonne="tauxRemplissage"
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      textAlign={"center"}
    >
      <GraphWrapper value={line.tauxRemplissage} />
    </ConditionalTd>
    <ConditionalTd colonne="positionQuadrant" colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      <Tooltip
        label={`Position dans le quadrant (millésimes ${formatMillesime(CURRENT_IJ_MILLESIME)})`}
        placement="top"
      >
        {line.positionQuadrant ?? "-"}
      </Tooltip>
    </ConditionalTd>
    <ConditionalTd
      colonne="tauxDevenirFavorable"
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      textAlign="center"
    >
      <GraphWrapper
        continuum={line.continuum}
        value={line.tauxDevenirFavorable}
        millesime={
          line.rentreeScolaire ?
            getMillesimeFromRentreeScolaire({rentreeScolaire: line.rentreeScolaire, offset: 0}) :
            CURRENT_IJ_MILLESIME
        }
      />
    </ConditionalTd>
    <ConditionalTd
      colonne="tauxInsertion"
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      textAlign={"center"}
    >
      <GraphWrapper
        continuum={line.continuum}
        value={line.tauxInsertion}
        millesime={
          line.rentreeScolaire ?
            getMillesimeFromRentreeScolaire({rentreeScolaire: line.rentreeScolaire, offset: 0}) :
            CURRENT_IJ_MILLESIME
        }
      />
    </ConditionalTd>
    <ConditionalTd
      colonne="tauxPoursuite"
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      textAlign={"center"}
    >
      <GraphWrapper
        continuum={line.continuum}
        value={line.tauxPoursuite}
        millesime={
          line.rentreeScolaire ?
            getMillesimeFromRentreeScolaire({rentreeScolaire: line.rentreeScolaire, offset: 0}) :
            CURRENT_IJ_MILLESIME
        }
      />
    </ConditionalTd>
    <ConditionalTd
      colonne="tauxDevenirFavorableEtablissement"
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      textAlign="center"
    >
      <GraphWrapper
        continuum={line.continuumEtablissement}
        value={line.tauxDevenirFavorableEtablissement}
        millesime={
          line.rentreeScolaire ?
            getMillesimeFromRentreeScolaire({rentreeScolaire: line.rentreeScolaire, offset: 0}) :
            CURRENT_IJ_MILLESIME
        }
      />
    </ConditionalTd>
    <ConditionalTd colonne="tauxInsertionEtablissement" colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      <GraphWrapper
        continuum={line.continuumEtablissement}
        value={line.tauxInsertionEtablissement}
        millesime={
          line.rentreeScolaire ?
            getMillesimeFromRentreeScolaire({rentreeScolaire: line.rentreeScolaire, offset: 0}) :
            CURRENT_IJ_MILLESIME
        }
      />
    </ConditionalTd>
    <ConditionalTd colonne="tauxPoursuiteEtablissement" colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
      <GraphWrapper
        continuum={line.continuumEtablissement}
        value={line.tauxPoursuiteEtablissement}
        millesime={
          line.rentreeScolaire ?
            getMillesimeFromRentreeScolaire({rentreeScolaire: line.rentreeScolaire, offset: 0}) :
            CURRENT_IJ_MILLESIME
        }
      />
    </ConditionalTd>
    <ConditionalTd colonne="valeurAjoutee" colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} isNumeric>
      {line.valeurAjoutee ?? "-"}
    </ConditionalTd>
  </>
);

export const EtablissementLineLoader = () => (
  <Tr bg={"grey.975"}>
    {new Array(17).fill(0).map((_, i) => {
      const key = `line_${i}`;
      return (
        <Td key={key}>
          <Skeleton opacity={0.3} height="16px" />
        </Td>
      );
    })}
  </Tr>
);

export const EtablissementLinePlaceholder = ({
  colonneFilters,
  getCellBgColor,
  user,
}: {
  colonneFilters: (FORMATION_ETABLISSEMENT_COLUMNS_KEYS)[];
  getCellBgColor: (column: FORMATION_ETABLISSEMENT_COLUMNS_KEYS) => string;
  user?: UserType;
}) => (
  <Tr bg={"grey.975"}>
    <EtablissementLineContent
      line={{}}
      colonneFilters={colonneFilters}
      getCellBgColor={getCellBgColor}
      user={user}
    />
  </Tr>
);
