import { Box, chakra, Flex, Text, Th, Tooltip } from "@chakra-ui/react";
import type { CSSProperties } from "react";
import { getMillesimeFromCampagne } from "shared/time/millesimes";

import { TooltipDefinitionAMICMA } from "@/app/(wrapped)/components/definitions/DefinitionAMICMA";
import { TooltipDefinitionColoration } from "@/app/(wrapped)/components/definitions/DefinitionColoration";
import { TooltipDefinitionFCIL } from "@/app/(wrapped)/components/definitions/DefinitionFCIL";
import { TooltipDefinitionPositionQuadrant } from "@/app/(wrapped)/components/definitions/DefinitionPositionQuadrant";
import { TooltipDefinitionTauxDePression } from "@/app/(wrapped)/components/definitions/DefinitionTauxDePression";
import { TooltipDefinitionTauxDevenirFavorable } from "@/app/(wrapped)/components/definitions/DefinitionTauxDevenirFavorable";
import { TooltipDefinitionTauxEmploi6Mois } from "@/app/(wrapped)/components/definitions/DefinitionTauxEmploi6Mois";
import { TooltipDefinitionTauxPoursuiteEtudes } from "@/app/(wrapped)/components/definitions/DefinitionTauxPoursuiteEtudes";
import { STATS_DEMANDES_COLUMNS } from "@/app/(wrapped)/demandes/restitution/STATS_DEMANDES_COLUMN";
import type { FiltersDemandesRestitution,OrderDemandesRestitution } from "@/app/(wrapped)/demandes/restitution/types";
import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
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
    overrideTooltip,
    icon
  }: {
    className?: string;
    style?: CSSProperties;
    children: React.ReactNode;
    colonneFilters: (keyof typeof STATS_DEMANDES_COLUMNS)[];
    colonne: keyof typeof STATS_DEMANDES_COLUMNS;
    onClick?: (column: OrderDemandesRestitution["orderBy"]) => void;
    isNumeric?: boolean;
    overrideTooltip?: (tooltip: string) => string;
    icon?: React.ReactNode;
  }) => {
    if (colonneFilters.includes(colonne))
      return (
        <Th
          p={2}
          className={className}
          style={style}
          isNumeric={isNumeric}
          cursor={onClick ? "pointer" : "default"}
          onClick={() => onClick && onClick(colonne as OrderDemandesRestitution["orderBy"])}
        >
          <Box maxW={170} sx={{
            display: "flex",
            alignItems: "center",
          }}>
            <Tooltip label={overrideTooltip ? overrideTooltip(STATS_DEMANDES_COLUMNS[colonne]) : STATS_DEMANDES_COLUMNS[colonne]} placement="top">
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
  activeFilters,
  colonneFilters,
  getCellColor,
  displayPilotageColumns,
  currentRS,
}: {
  order: OrderDemandesRestitution;
  handleOrder: (column: OrderDemandesRestitution["orderBy"]) => void;
  activeFilters: FiltersDemandesRestitution;
  colonneFilters: (keyof typeof STATS_DEMANDES_COLUMNS)[];
  getCellColor: (column: keyof typeof STATS_DEMANDES_COLUMNS) => string;
  displayPilotageColumns: boolean;
  currentRS: string;
}) => {
  const { openGlossaire } = useGlossaireContext();
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
        {STATS_DEMANDES_COLUMNS.libelleEtablissement}
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
        {STATS_DEMANDES_COLUMNS.commune}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleRegion"}
        onClick={handleOrder}
        bgColor={getCellColor("libelleRegion")}
      >
        <OrderIcon {...order} column="libelleRegion" />
        {STATS_DEMANDES_COLUMNS.libelleRegion}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleAcademie"}
        onClick={handleOrder}
        bgColor={getCellColor("libelleAcademie")}
      >
        <OrderIcon {...order} column="libelleAcademie" />
        {STATS_DEMANDES_COLUMNS.libelleAcademie}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"secteur"}
        onClick={handleOrder}
        bgColor={getCellColor("secteur")}
      >
        <OrderIcon {...order} column="secteur" />
        {STATS_DEMANDES_COLUMNS.secteur}
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
        {STATS_DEMANDES_COLUMNS.libelleNsf}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleFormation"}
        onClick={handleOrder}
        bgColor={getCellColor("libelleFormation")}
      >
        <OrderIcon {...order} column="libelleFormation" />
        {STATS_DEMANDES_COLUMNS.libelleFormation}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"formationSpecifique"}
        bgColor={getCellColor("formationSpecifique")}
      >
        {STATS_DEMANDES_COLUMNS.formationSpecifique}
        <TooltipIcon ml="1" mt="1px" label="Cliquez pour plus d'infos." onClick={() => openGlossaire("formation-specifique")} />
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleNiveauDiplome"}
        onClick={handleOrder}
        bgColor={getCellColor("libelleNiveauDiplome")}
      >
        <OrderIcon {...order} column="libelleNiveauDiplome" />
        {STATS_DEMANDES_COLUMNS.libelleNiveauDiplome}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"typeDemande"}
        onClick={handleOrder}
        bgColor={getCellColor("typeDemande")}
      >
        <OrderIcon {...order} column="typeDemande" />
        {STATS_DEMANDES_COLUMNS.typeDemande}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"motif"}
        onClick={handleOrder}
        bgColor={getCellColor("motif")}
      >
        <OrderIcon {...order} column="motif" />
        {STATS_DEMANDES_COLUMNS.motif}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"differenceCapaciteScolaire"}
        onClick={handleOrder}
        isNumeric
        bgColor={getCellColor("differenceCapaciteScolaire")}
      >
        <OrderIcon {...order} column="differenceCapaciteScolaire" />
        {STATS_DEMANDES_COLUMNS.differenceCapaciteScolaire}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"differenceCapaciteApprentissage"}
        onClick={handleOrder}
        isNumeric
        bgColor={getCellColor("differenceCapaciteApprentissage")}
      >
        <OrderIcon {...order} column="differenceCapaciteApprentissage" />
        {STATS_DEMANDES_COLUMNS.differenceCapaciteApprentissage}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"differenceCapaciteScolaireColoree"}
        onClick={handleOrder}
        isNumeric
        bgColor={getCellColor("differenceCapaciteScolaireColoree")}
      >
        <OrderIcon {...order} column="differenceCapaciteScolaireColoree" />
        {STATS_DEMANDES_COLUMNS.differenceCapaciteScolaireColoree}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"differenceCapaciteApprentissageColoree"}
        onClick={handleOrder}
        isNumeric
        bgColor={getCellColor("differenceCapaciteApprentissageColoree")}
      >
        <OrderIcon {...order} column="differenceCapaciteApprentissageColoree" />
        {STATS_DEMANDES_COLUMNS.differenceCapaciteApprentissageColoree}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleColoration"}
        onClick={handleOrder}
        bgColor={getCellColor("libelleColoration")}
        icon={<TooltipDefinitionColoration />}
      >
        <OrderIcon {...order} column="libelleColoration" />
        {STATS_DEMANDES_COLUMNS.libelleColoration}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleFCIL"}
        onClick={handleOrder}
        bgColor={getCellColor("libelleFCIL")}
        icon={<TooltipDefinitionFCIL />}
      >
        <OrderIcon {...order} column="libelleFCIL" />
        {STATS_DEMANDES_COLUMNS.libelleFCIL}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"amiCma"}
        onClick={handleOrder}
        bgColor={getCellColor("amiCma")}
        icon={<TooltipDefinitionAMICMA />}
      >
        <OrderIcon {...order} column="amiCma" />
        {STATS_DEMANDES_COLUMNS.amiCma}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"amiCmaValide"}
        onClick={handleOrder}
        bgColor={getCellColor("amiCmaValide")}
      >
        <OrderIcon {...order} column="amiCmaValide" />
        {STATS_DEMANDES_COLUMNS.amiCmaValide}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"amiCmaEnCoursValidation"}
        onClick={handleOrder}
        bgColor={getCellColor("amiCmaEnCoursValidation")}
      >
        <OrderIcon {...order} column="amiCmaEnCoursValidation" />
        {STATS_DEMANDES_COLUMNS.amiCmaEnCoursValidation}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"amiCmaValideAnnee"}
        onClick={handleOrder}
        bgColor={getCellColor("amiCmaValideAnnee")}
      >
        <OrderIcon {...order} column="amiCmaValideAnnee" />
        {STATS_DEMANDES_COLUMNS.amiCmaValideAnnee}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"filiereCmq"}
        onClick={handleOrder}
        bgColor={getCellColor("filiereCmq")}
      >
        <OrderIcon {...order} column="filiereCmq" />
        {STATS_DEMANDES_COLUMNS.filiereCmq}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"nomCmq"}
        onClick={handleOrder}
        bgColor={getCellColor("nomCmq")}
      >
        <OrderIcon {...order} column="nomCmq" />
        {STATS_DEMANDES_COLUMNS.nomCmq}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"inspecteurReferent"}
        onClick={handleOrder}
        bgColor={getCellColor("inspecteurReferent")}
      >
        <OrderIcon {...order} column="inspecteurReferent" />
        {STATS_DEMANDES_COLUMNS.inspecteurReferent}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"partenaireEconomique1"}
        onClick={handleOrder}
        bgColor={getCellColor("partenaireEconomique1")}
      >
        <OrderIcon {...order} column="partenaireEconomique1" />
        {STATS_DEMANDES_COLUMNS.partenaireEconomique1}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"partenaireEconomique2"}
        onClick={handleOrder}
        bgColor={getCellColor("partenaireEconomique2")}
      >
        <OrderIcon {...order} column="partenaireEconomique2" />
        {STATS_DEMANDES_COLUMNS.partenaireEconomique2}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"commentaire"}
        onClick={handleOrder}
        bgColor={getCellColor("commentaire")}
      >
        <OrderIcon {...order} column="commentaire" />
        {STATS_DEMANDES_COLUMNS.commentaire}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"numero"}
        onClick={handleOrder}
        bgColor={getCellColor("numero")}
      >
        <OrderIcon {...order} column="numero" />
        {STATS_DEMANDES_COLUMNS.numero}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"positionQuadrant"}
        isNumeric
        bgColor={getCellColor("positionQuadrant")}
        icon={<TooltipDefinitionPositionQuadrant
          millesime={getMillesimeFromCampagne(activeFilters.campagne!)}
        />}
      >
        {STATS_DEMANDES_COLUMNS.positionQuadrant}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"tauxInsertionRegional"}
        onClick={handleOrder}
        textAlign="center"
        minW={200}
        maxW={200}
        bgColor={getCellColor("tauxInsertionRegional")}
        icon={<TooltipDefinitionTauxEmploi6Mois
          millesime={getMillesimeFromCampagne(activeFilters.campagne!)}
        />}
      >
        <OrderIcon {...order} column="tauxInsertionRegional" />
        {STATS_DEMANDES_COLUMNS.tauxInsertionRegional}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"tauxPoursuiteRegional"}
        onClick={handleOrder}
        textAlign="center"
        bgColor={getCellColor("tauxPoursuiteRegional")}
        icon={<TooltipDefinitionTauxPoursuiteEtudes
          millesime={getMillesimeFromCampagne(activeFilters.campagne!)}
        />}
      >
        <OrderIcon {...order} column="tauxPoursuiteRegional" />
        {STATS_DEMANDES_COLUMNS.tauxPoursuiteRegional}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"tauxDevenirFavorableRegional"}
        onClick={handleOrder}
        textAlign="center"
        bgColor={getCellColor("tauxDevenirFavorableRegional")}
        icon={<TooltipDefinitionTauxDevenirFavorable
          millesime={getMillesimeFromCampagne(activeFilters.campagne!)}
        />}
      >
        <OrderIcon {...order} column="tauxDevenirFavorableRegional" />
        {STATS_DEMANDES_COLUMNS.tauxDevenirFavorableRegional}
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
        {STATS_DEMANDES_COLUMNS.tauxPressionRegional}
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
        {STATS_DEMANDES_COLUMNS.nbEtablissement}
        <TooltipIcon ml="1" mt="1px" label="Le nombre d'établissement dispensant la formation dans la région." />
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"nbRecrutementRH"}
        onClick={handleOrder}
        bgColor={getCellColor("nbRecrutementRH")}
      >
        <OrderIcon {...order} column="nbRecrutementRH" />
        {STATS_DEMANDES_COLUMNS.nbRecrutementRH}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"nbReconversionRH"}
        onClick={handleOrder}
        bgColor={getCellColor("nbReconversionRH")}
      >
        <OrderIcon {...order} column="nbReconversionRH" />
        {STATS_DEMANDES_COLUMNS.nbReconversionRH}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"nbProfesseurAssocieRH"}
        onClick={handleOrder}
        bgColor={getCellColor("nbProfesseurAssocieRH")}
      >
        <OrderIcon {...order} column="nbProfesseurAssocieRH" />
        {STATS_DEMANDES_COLUMNS.nbProfesseurAssocieRH}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"nbFormationRH"}
        onClick={handleOrder}
        bgColor={getCellColor("nbFormationRH")}
      >
        <OrderIcon {...order} column="nbFormationRH" />
        {STATS_DEMANDES_COLUMNS.nbFormationRH}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"travauxAmenagement"}
        onClick={handleOrder}
        bgColor={getCellColor("travauxAmenagement")}
      >
        <OrderIcon {...order} column="travauxAmenagement" />
        {STATS_DEMANDES_COLUMNS.travauxAmenagement}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"travauxAmenagementCout"}
        onClick={handleOrder}
        bgColor={getCellColor("travauxAmenagementCout")}
      >
        <OrderIcon {...order} column="travauxAmenagementCout" />
        {STATS_DEMANDES_COLUMNS.travauxAmenagementCout}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"travauxAmenagementDescription"}
        onClick={handleOrder}
        bgColor={getCellColor("travauxAmenagementDescription")}
      >
        <OrderIcon {...order} column="travauxAmenagementDescription" />
        {STATS_DEMANDES_COLUMNS.travauxAmenagementDescription}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"achatEquipement"}
        onClick={handleOrder}
        bgColor={getCellColor("achatEquipement")}
      >
        <OrderIcon {...order} column="achatEquipement" />
        {STATS_DEMANDES_COLUMNS.achatEquipement}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"achatEquipementCout"}
        onClick={handleOrder}
        bgColor={getCellColor("achatEquipementCout")}
      >
        <OrderIcon {...order} column="achatEquipementCout" />
        {STATS_DEMANDES_COLUMNS.achatEquipementCout}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"achatEquipementDescription"}
        onClick={handleOrder}
        bgColor={getCellColor("achatEquipementDescription")}
      >
        <OrderIcon {...order} column="achatEquipementDescription" />
        {STATS_DEMANDES_COLUMNS.achatEquipementDescription}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"augmentationCapaciteAccueilHebergement"}
        onClick={handleOrder}
        bgColor={getCellColor("augmentationCapaciteAccueilHebergement")}
      >
        <OrderIcon {...order} column="augmentationCapaciteAccueilHebergement" />
        {STATS_DEMANDES_COLUMNS.augmentationCapaciteAccueilHebergement}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"augmentationCapaciteAccueilHebergementPlaces"}
        onClick={handleOrder}
        bgColor={getCellColor("augmentationCapaciteAccueilHebergementPlaces")}
      >
        <OrderIcon {...order} column="augmentationCapaciteAccueilHebergementPlaces" />
        {STATS_DEMANDES_COLUMNS.augmentationCapaciteAccueilHebergementPlaces}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"augmentationCapaciteAccueilHebergementPrecisions"}
        onClick={handleOrder}
        bgColor={getCellColor("augmentationCapaciteAccueilHebergementPrecisions")}
      >
        <OrderIcon {...order} column="augmentationCapaciteAccueilHebergementPrecisions" />
        {STATS_DEMANDES_COLUMNS.augmentationCapaciteAccueilHebergementPrecisions}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"augmentationCapaciteAccueilRestauration"}
        onClick={handleOrder}
        bgColor={getCellColor("augmentationCapaciteAccueilRestauration")}
      >
        <OrderIcon {...order} column="augmentationCapaciteAccueilRestauration" />
        {STATS_DEMANDES_COLUMNS.augmentationCapaciteAccueilRestauration}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"augmentationCapaciteAccueilRestaurationPlaces"}
        onClick={handleOrder}
        bgColor={getCellColor("augmentationCapaciteAccueilRestaurationPlaces")}
      >
        <OrderIcon {...order} column="augmentationCapaciteAccueilRestaurationPlaces" />
        {STATS_DEMANDES_COLUMNS.augmentationCapaciteAccueilRestaurationPlaces}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"augmentationCapaciteAccueilRestaurationPrecisions"}
        onClick={handleOrder}
        bgColor={getCellColor("augmentationCapaciteAccueilRestaurationPrecisions")}
      >
        <OrderIcon {...order} column="augmentationCapaciteAccueilRestaurationPrecisions" />
        {STATS_DEMANDES_COLUMNS.augmentationCapaciteAccueilRestaurationPrecisions}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"statut"}
        onClick={handleOrder}
        bgColor={getCellColor("statut")}
      >
        <OrderIcon {...order} column="statut" />
        {STATS_DEMANDES_COLUMNS.statut}
      </ConditionalTh>
      <ConditionalTh colonneFilters={colonneFilters} colonne={"motifRefus"} bgColor={getCellColor("motifRefus")}>
        {STATS_DEMANDES_COLUMNS.motifRefus}
      </ConditionalTh>
      {displayPilotageColumns && (
        <>
          <ConditionalTh colonneFilters={colonneFilters} colonne={"pilotageCapacite"} bgColor={getCellColor("pilotageCapacite")} overrideTooltip={(tooltip) => tooltip.replace("{0}", currentRS)}>
            {STATS_DEMANDES_COLUMNS.pilotageCapacite.replace("{0}", currentRS)}
            <TooltipIcon
              ml="1"
              mt="1px"
              label={
                <Flex direction="column" gap={2}>
                  <Text>Capacité théorique issue d'Affelnet pour la rentrée 2024, voie scolaire</Text>
                  <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
                </Flex>
              }
              onClick={() => openGlossaire("capacite")}
              placement={"bottom-end"}
            />
          </ConditionalTh>
          <ConditionalTh
            colonneFilters={colonneFilters}
            colonne={"pilotageEffectif"}
            bgColor={getCellColor("pilotageEffectif")}
            overrideTooltip={(tooltip) => tooltip.replace("{0}", currentRS)}
          >
            {STATS_DEMANDES_COLUMNS.pilotageEffectif.replace("{0}", currentRS)}
            <TooltipIcon
              ml="1"
              mt="1px"
              label={
                <Flex direction="column" gap={2}>
                  <Text>
                    Effectif en entrée de formation issue du Constat de Rentrée 2024,
                    comptant uniquement les élèves en voie scolaire
                  </Text>
                  <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
                </Flex>
              }
              onClick={() => openGlossaire("effectif-en-entree")}
              placement={"bottom-end"}
            />
          </ConditionalTh>
          <ConditionalTh
            colonneFilters={colonneFilters}
            colonne={"pilotageTauxRemplissage"}
            bgColor={getCellColor("pilotageTauxRemplissage")}
            overrideTooltip={(tooltip) => tooltip.replace("{0}", currentRS)}
            maxW={200}
          >
            {STATS_DEMANDES_COLUMNS.pilotageTauxRemplissage.replace("{0}", currentRS)}
            <TooltipIcon
              ml="1"
              mt="1px"
              label={
                <Flex direction="column" gap={2}>
                  <Text>
                    Taux de remplissage par rapport à la capacité théorique
                    d'Affelnet pour la rentrée 2024, voie scolaire
                  </Text>
                  <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
                </Flex>
              }
              onClick={() => openGlossaire("taux-de-remplissage")}
              placement={"bottom-end"}
            />
          </ConditionalTh>
          <ConditionalTh
            colonneFilters={colonneFilters}
            colonne={"pilotageTauxPression"}
            bgColor={getCellColor("pilotageTauxPression")}
            overrideTooltip={(tooltip) => tooltip.replace("{0}", currentRS)}
            maxW={200}
          >
            {STATS_DEMANDES_COLUMNS.pilotageTauxPression.replace("{0}", currentRS)}
            <TooltipIcon
              ml="1"
              mt="1px"
              label={
                <Flex direction="column" gap={2}>
                  <Text>
                    Taux de pression (ou de demande dans le cas des BTS)
                    issue d'Affelnet pour la rentrée 2024, voie scolaire
                  </Text>
                  <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
                </Flex>
              }
              onClick={() => openGlossaire("taux-de-pression")}
              placement={"bottom-end"}
            />
          </ConditionalTh>
          <ConditionalTh
            colonneFilters={colonneFilters}
            colonne={"pilotageTauxDemande"}
            bgColor={getCellColor("pilotageTauxDemande")}
            overrideTooltip={(tooltip) => tooltip.replace("{0}", currentRS)}
            maxW={200}
          >
            {STATS_DEMANDES_COLUMNS.pilotageTauxDemande.replace("{0}", currentRS)}
            <TooltipIcon
              ml="1"
              mt="1px"
              label={
                <Flex direction="column" gap={2}>
                  <Text>Le ratio entre le nombre de voeux et la capacité de la formation dans l'établissement.</Text>
                  <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
                </Flex>
              }
              onClick={() => openGlossaire("taux-de-demande")}
              placement={"bottom-end"}
            />
          </ConditionalTh>
        </>
      )}
    </>
  );
};
