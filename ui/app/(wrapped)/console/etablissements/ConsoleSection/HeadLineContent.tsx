import {Box, chakra, Flex, Text, Th, Thead, Tooltip, Tr, VisuallyHidden} from '@chakra-ui/react';
import { usePlausible } from "next-plausible";
import type { CSSProperties } from "react";
import { CURRENT_IJ_MILLESIME } from 'shared';

import { ETABLISSEMENT_COLUMN_WIDTH } from "@/app/(wrapped)/console/etablissements/ETABLISSEMENT_COLUMN_WIDTH";
import { FORMATION_ETABLISSEMENT_COLUMNS } from "@/app/(wrapped)/console/etablissements/FORMATION_ETABLISSEMENT_COLUMNS";
import type { Filters, Order } from "@/app/(wrapped)/console/etablissements/types";
import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { OrderIcon } from "@/components/OrderIcon";
import { TauxPressionScale } from "@/components/TauxPressionScale";
import { TooltipIcon } from "@/components/TooltipIcon";
import { formatMillesime } from '@/utils/formatLibelle';

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
    colonneFilters: (keyof typeof FORMATION_ETABLISSEMENT_COLUMNS)[];
    colonne: keyof typeof FORMATION_ETABLISSEMENT_COLUMNS;
    getCellBgColor: (column: keyof typeof FORMATION_ETABLISSEMENT_COLUMNS) => string;
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
          <Tooltip label={FORMATION_ETABLISSEMENT_COLUMNS[colonne]} placement="top">
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
  isFirstColumnSticky,
  isSecondColumnSticky,
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
  isFirstColumnSticky?: boolean;
  isSecondColumnSticky?: boolean;
  colonneFilters: (keyof typeof FORMATION_ETABLISSEMENT_COLUMNS)[];
  getCellBgColor: (column: keyof typeof FORMATION_ETABLISSEMENT_COLUMNS) => string;
}) => {
  const { openGlossaire } = useGlossaireContext();
  const trackEvent = usePlausible();

  const handleOrder = (column: Order["orderBy"]) => {
    trackEvent("etablissements:ordre", { props: { colonne: column } });
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
    <Thead position="sticky" top="0" boxShadow="0 0 6px 0 rgb(0,0,0,0.15)" zIndex={"docked"}>
      <Tr bg={"white"}>
        <Th>
          <VisuallyHidden>Historique</VisuallyHidden>
        </Th>
        <ConditionalTh colonneFilters={colonneFilters} getCellBgColor={getCellBgColor} colonne="rentreeScolaire">
          {FORMATION_ETABLISSEMENT_COLUMNS.rentreeScolaire}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="libelleEtablissement"
          cursor="pointer"
          onClick={handleOrder}
          minW={ETABLISSEMENT_COLUMN_WIDTH}
          maxW={ETABLISSEMENT_COLUMN_WIDTH}
          left={0}
          zIndex={1}
          position={{ lg: "relative", xl: "sticky" }}
          boxShadow={{
            lg: "none",
            xl: isFirstColumnSticky ? "inset -2px 0px 0px 0px #E2E8F0" : "none",
          }}
        >
          <OrderIcon {...order} column="libelleEtablissement" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleEtablissement}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="commune"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="commune" />
          {FORMATION_ETABLISSEMENT_COLUMNS.commune}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="libelleDepartement"
          cursor="pointer"
        >
          <OrderIcon {...order} column="libelleDepartement" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleDepartement}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="secteur"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="secteur" />
          {FORMATION_ETABLISSEMENT_COLUMNS.secteur}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="uai"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="uai" />
          {FORMATION_ETABLISSEMENT_COLUMNS.uai}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="libelleDispositif"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="libelleDispositif" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleDispositif}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="libelleFormation"
          cursor="pointer"
          onClick={handleOrder}
          minW={450}
          zIndex={1}
          position={{ lg: "relative", xl: "sticky" }}
          left={{ lg: "unset", xl: 300 - 1 }}
          boxShadow={{
            lg: "none",
            xl: isSecondColumnSticky ? "inset -2px 0px 0px 0px #E2E8F0" : "none",
          }}
        >
          <OrderIcon {...order} column="libelleFormation" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleFormation}
        </ConditionalTh>
        <ConditionalTh colonne={"formationSpecifique"} colonneFilters={colonneFilters} getCellBgColor={getCellBgColor}>
          {FORMATION_ETABLISSEMENT_COLUMNS.formationSpecifique}
          <TooltipIcon
            ml="1"
            label="Cliquez pour plus d'infos."
            onClick={() => openGlossaire("formation-specifique")}
          />
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="libelleNiveauDiplome"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="libelleNiveauDiplome" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleNiveauDiplome}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="libelleFamille"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="libelleFamille" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleFamille}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="cfd"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="cfd" />
          {FORMATION_ETABLISSEMENT_COLUMNS.cfd}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="cpc"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="cpc" />
          {FORMATION_ETABLISSEMENT_COLUMNS.cpc}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="cpcSecteur"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="cpcSecteur" />
          {FORMATION_ETABLISSEMENT_COLUMNS.cpcSecteur}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="libelleNsf"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="libelleNsf" />
          {FORMATION_ETABLISSEMENT_COLUMNS.libelleNsf}
          <TooltipIcon
            ml="1"
            label="Cliquez pour plus d'infos."
            onClick={() => openGlossaire("domaine-de-formation-nsf")}
          />
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="effectif1"
          isNumeric
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="effectif1" />
          {FORMATION_ETABLISSEMENT_COLUMNS.effectif1}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>Nb d'élèves.</Text>
                <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            onClick={() => openGlossaire("nombre-deleves")}
          />
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="effectif2"
          isNumeric
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="effectif2" />
          {FORMATION_ETABLISSEMENT_COLUMNS.effectif2}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>Nb d'élèves.</Text>
                <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            onClick={() => openGlossaire("nombre-deleves")}
          />
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="effectif3"
          isNumeric
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="effectif3" />
          {FORMATION_ETABLISSEMENT_COLUMNS.effectif3}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>Nb d'élèves.</Text>
                <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            onClick={() => openGlossaire("nombre-deleves")}
          />
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="effectifEntree"
          cursor="pointer"
          onClick={handleOrder}
          width={"fit-content"}
        >
          <OrderIcon {...order} column="effectifEntree" />
          {FORMATION_ETABLISSEMENT_COLUMNS.effectifEntree}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>Effectifs en entrée en première année de formation.</Text>
                <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            onClick={() => openGlossaire("effectif-en-entree")}
          />
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="capacite"
          isNumeric
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="capacite" />
          {FORMATION_ETABLISSEMENT_COLUMNS.capacite}
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="tauxPression"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="tauxPression" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxPression}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>
                  Le ratio entre le nombre de premiers voeux et la capacité de la formation au niveau régional.
                </Text>
                <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
                <TauxPressionScale />
              </Box>
            }
            onClick={() => openGlossaire("taux-de-pression")}
          />
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="tauxRemplissage"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="tauxRemplissage" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxRemplissage}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>Le ratio entre l’effectif d’entrée en formation et sa capacité.</Text>
                <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            onClick={() => openGlossaire("taux-de-remplissage")}
          />
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="positionQuadrant"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="positionQuadrant" />
          {FORMATION_ETABLISSEMENT_COLUMNS.positionQuadrant}
          <TooltipIcon
            ml="1"
            label={
              <Flex direction="column" gap={2}>
                <Text>
                  Positionnement du point de la formation dans le quadrant par rapport aux moyennes régionales des taux
                  d'emploi et de poursuite d'études appliquées au niveau de diplôme.
                </Text>
                <Text>
                  Tous les taux InserJeunes affichés correspondent aux derniers millésimes disponibles
                  ({formatMillesime(CURRENT_IJ_MILLESIME)}), quelle que soit la rentrée scolaire.
                </Text>
                <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
              </Flex>
            }
            onClick={() => openGlossaire("quadrant")}
          />
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="tauxInsertion"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="tauxInsertion" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxInsertion}
          <TooltipIcon
            ml="1"
            label={
              <Flex direction="column" gap={2}>
                <Text>La part de ceux qui sont en emploi 6 mois après leur sortie d’étude.</Text>
                <Text>
                  Tous les taux InserJeunes affichés correspondent aux derniers millésimes disponibles
                  ({formatMillesime(CURRENT_IJ_MILLESIME)}), quelle que soit la rentrée scolaire.
                </Text>
                <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
              </Flex>
            }
            onClick={() => openGlossaire("taux-emploi-6-mois")}
          />
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="tauxPoursuite"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="tauxPoursuite" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxPoursuite}
          <TooltipIcon
            ml="1"
            label={
              <Flex direction="column" gap={2}>
                <Text>Tout élève inscrit à N+1 (réorientation et redoublement compris).</Text>
                <Text>
                  Tous les taux InserJeunes affichés correspondent aux derniers millésimes disponibles
                  ({formatMillesime(CURRENT_IJ_MILLESIME)}), quelle que soit la rentrée scolaire.
                </Text>
                <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
              </Flex>
            }
            onClick={() => openGlossaire("taux-poursuite-etudes")}
          />
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="tauxDevenirFavorable"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="tauxDevenirFavorable" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxDevenirFavorable}
          <TooltipIcon
            ml="1"
            label={
              <Flex direction="column" gap={2}>
                <Text>
                  (nombre d'élèves inscrits en formation + nombre d'élèves en emploi) / nombre d'élèves en entrée en
                  dernière année de formation.
                </Text>
                <Text>
                  Tous les taux InserJeunes affichés correspondent aux derniers millésimes disponibles
                  ({formatMillesime(CURRENT_IJ_MILLESIME)}), quelle que soit la rentrée scolaire.
                </Text>
                <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
              </Flex>
            }
            onClick={() => openGlossaire("taux-de-devenir-favorable")}
          />
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="tauxInsertionEtablissement"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="tauxInsertionEtablissement" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxInsertionEtablissement}
          <TooltipIcon
            ml="1"
            label={
              <Flex direction="column" gap={2}>
                <Text>La part de ceux qui sont en emploi 6 mois après leur sortie d’étude.</Text>
                <Text>
                  Tous les taux InserJeunes affichés correspondent aux derniers millésimes disponibles
                  ({formatMillesime(CURRENT_IJ_MILLESIME)}), quelle que soit la rentrée scolaire.
                </Text>
                <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
              </Flex>
            }
            onClick={() => openGlossaire("taux-de-devenir-favorable")}
          />
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="tauxPoursuiteEtablissement"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="tauxPoursuiteEtablissement" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxPoursuiteEtablissement}
          <TooltipIcon
            ml="1"
            label={
              <Flex direction="column" gap={2}>
                <Text>Tout élève inscrit à N+1 (réorientation et redoublement compris).</Text>
                <Text>
                  Tous les taux InserJeunes affichés correspondent aux derniers millésimes disponibles
                  ({formatMillesime(CURRENT_IJ_MILLESIME)}), quelle que soit la rentrée scolaire.
                </Text>
                <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
              </Flex>
            }
            onClick={() => openGlossaire("taux-poursuite-etudes")}
          />
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="tauxDevenirFavorableEtablissement"
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="tauxDevenirFavorableEtablissement" />
          {FORMATION_ETABLISSEMENT_COLUMNS.tauxDevenirFavorableEtablissement}
          <TooltipIcon
            ml="1"
            label={
              <Flex direction="column" gap={2}>
                <Text>
                  (nombre d'élèves inscrits en formation + nombre d'élèves en emploi) / nombre d'élèves en entrée en
                  dernière année de formation.
                </Text>
                <Text>
                  Tous les taux InserJeunes affichés correspondent aux derniers millésimes disponibles
                  ({formatMillesime(CURRENT_IJ_MILLESIME)}), quelle que soit la rentrée scolaire.
                </Text>
                <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
              </Flex>
            }
            onClick={() => openGlossaire("taux-de-devenir-favorable")}
          />
        </ConditionalTh>
        <ConditionalTh
          colonneFilters={colonneFilters}
          getCellBgColor={getCellBgColor}
          colonne="valeurAjoutee"
          isNumeric
          cursor="pointer"
          onClick={handleOrder}
        >
          <OrderIcon {...order} column="valeurAjoutee" />
          {FORMATION_ETABLISSEMENT_COLUMNS.valeurAjoutee}
          <TooltipIcon
            ml="1"
            label={
              <Box>
                <Text>
                  Capacité de l'établissement à insérer, en prenant en compte le profil social des élèves et le taux de
                  chômage de la zone d'emploi, comparativement au taux de référence d’établissements similaires.
                </Text>
                <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            onClick={() => openGlossaire("valeur-ajoutee")}
          />
        </ConditionalTh>
      </Tr>
    </Thead>
  );
};
