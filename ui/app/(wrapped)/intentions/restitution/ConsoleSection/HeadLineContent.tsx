import { Box, chakra, Text, Tooltip } from "@chakra-ui/react";
import type { CSSProperties, ReactNode } from "react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { STATS_DEMANDES_COLUMNS } from "@/app/(wrapped)/intentions/restitution/STATS_DEMANDES_COLUMN";
import type { OrderDemandesRestitutionIntentions } from "@/app/(wrapped)/intentions/restitution/types";
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
    overrideTooltip,
  }: {
    className?: string;
    style?: CSSProperties;
    children: ReactNode;
    colonneFilters: (keyof typeof STATS_DEMANDES_COLUMNS)[];
    colonne: keyof typeof STATS_DEMANDES_COLUMNS;
    handleOrder?: (colonne: OrderDemandesRestitutionIntentions["orderBy"]) => void;
    getCellBgColor: (colonne: keyof typeof STATS_DEMANDES_COLUMNS) => string;
    order: Partial<OrderDemandesRestitutionIntentions>,
    isNumeric?: boolean;
    overrideTooltip?: (tooltip: string) => string;
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
          handleOrder={handleOrder ? (colonne) => handleOrder(colonne as OrderDemandesRestitutionIntentions["orderBy"]) : undefined}
          bgColor={getCellBgColor(colonne)}
        >
          <Tooltip label={overrideTooltip ? overrideTooltip(STATS_DEMANDES_COLUMNS[colonne]) : STATS_DEMANDES_COLUMNS[colonne]} placement="top">
            {children}
          </Tooltip>
        </SortableTh>
      );
    return null;
  },
  { shouldForwardProp: (_prop) => true }
);

export const HeadLineContent = ({
  order,
  handleOrder,
  colonneFilters,
  getCellBgColor,
  displayPilotageColumns,
  currentRS,
}: {
  order: OrderDemandesRestitutionIntentions;
  handleOrder: (column: OrderDemandesRestitutionIntentions["orderBy"]) => void;
  colonneFilters: (keyof typeof STATS_DEMANDES_COLUMNS)[];
  getCellBgColor: (column: keyof typeof STATS_DEMANDES_COLUMNS) => string;
  displayPilotageColumns: boolean;
  currentRS: string;
}) => {
  const { openGlossaire } = useGlossaireContext();
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
        {STATS_DEMANDES_COLUMNS.libelleEtablissement}
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
        {STATS_DEMANDES_COLUMNS.commune}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleRegion"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.libelleRegion}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleAcademie"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.libelleAcademie}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"secteur"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.secteur}
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
        {STATS_DEMANDES_COLUMNS.libelleNsf}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleFormation"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.libelleFormation}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"formationSpecifique"}
        getCellBgColor={getCellBgColor}
      >
        {STATS_DEMANDES_COLUMNS.formationSpecifique}
        <TooltipIcon ml="1" mt="1px" label="Cliquez pour plus d'infos." onClick={() => openGlossaire("formation-specifique")} />
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleNiveauDiplome"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.libelleNiveauDiplome}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"typeDemande"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.typeDemande}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"motif"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.motif}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"differenceCapaciteScolaire"}
        isNumeric
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.differenceCapaciteScolaire}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"differenceCapaciteApprentissage"}
        isNumeric
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.differenceCapaciteApprentissage}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"differenceCapaciteScolaireColoree"}
        isNumeric
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.differenceCapaciteScolaireColoree}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"differenceCapaciteApprentissageColoree"}
        isNumeric
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.differenceCapaciteApprentissageColoree}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleColoration"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.libelleColoration}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleFCIL"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.libelleFCIL}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"amiCma"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.amiCma}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"amiCmaValide"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.amiCmaValide}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"amiCmaEnCoursValidation"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.amiCmaEnCoursValidation}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"amiCmaValideAnnee"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.amiCmaValideAnnee}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"filiereCmq"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.filiereCmq}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"nomCmq"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.nomCmq}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"inspecteurReferent"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.inspecteurReferent}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"partenaireEconomique1"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.partenaireEconomique1}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"partenaireEconomique2"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.partenaireEconomique2}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"commentaire"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.commentaire}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"numero"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.numero}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"positionQuadrant"}
        isNumeric
        getCellBgColor={getCellBgColor}
        order={order}
      >
        <TooltipIcon
          mr="1"
          label="Positionnement du point de la formation dans le quadrant par rapport aux moyennes régionales des taux d'emploi et de poursuite d'études appliquées au niveau de diplôme."
          placement={"bottom-end"}
        />
        {STATS_DEMANDES_COLUMNS.positionQuadrant}
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
        {STATS_DEMANDES_COLUMNS.tauxInsertionRegional}
        <TooltipIcon
          ml="1"
          mt="1px"
          label="La part de ceux qui sont en emploi 6 mois après leur sortie d’étude pour cette formation à l'échelle régionale (voie scolaire)."
          placement={"bottom-end"}
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
        {STATS_DEMANDES_COLUMNS.tauxPoursuiteRegional}
        <TooltipIcon
          ml="1"
          mt="1px"
          label="Tout élève inscrit à N+1 (réorientation et redoublement compris) pour cette formation à l'échelle régionale (voie scolaire)."
          placement={"bottom-end"}
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
        {STATS_DEMANDES_COLUMNS.tauxDevenirFavorableRegional}
        <TooltipIcon
          ml="2"
          label="(nombre d'élèves inscrits en formation + nombre d'élèves en emploi) / nombre d'élèves en entrée en dernière année de formation pour cette formation à l'échelle régionale (voie scolaire)."
          placement={"bottom-end"}
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
        {STATS_DEMANDES_COLUMNS.tauxPressionRegional}
        <TooltipIcon
          ml="1"
          mt="1px"
          label={
            <>
              <Box>Le ratio entre le nombre de premiers voeux et la capacité de la formation au niveau régional.</Box>
              <TauxPressionScale />
            </>
          }
          placement={"bottom-end"}
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
        {STATS_DEMANDES_COLUMNS.nbEtablissement}
        <TooltipIcon ml="1" mt="1px" label="Le nombre d'établissement dispensant la formation dans la région." />
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"nbRecrutementRH"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.nbRecrutementRH}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"nbReconversionRH"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.nbReconversionRH}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"nbProfesseurAssocieRH"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.nbProfesseurAssocieRH}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"nbFormationRH"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.nbFormationRH}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"travauxAmenagement"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.travauxAmenagement}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"travauxAmenagementCout"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.travauxAmenagementCout}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"travauxAmenagementDescription"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.travauxAmenagementDescription}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"achatEquipement"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.achatEquipement}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"achatEquipementCout"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.achatEquipementCout}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"achatEquipementDescription"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.achatEquipementDescription}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"augmentationCapaciteAccueilHebergement"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.augmentationCapaciteAccueilHebergement}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"augmentationCapaciteAccueilHebergementPlaces"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.augmentationCapaciteAccueilHebergementPlaces}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"augmentationCapaciteAccueilHebergementPrecisions"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.augmentationCapaciteAccueilHebergementPrecisions}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"augmentationCapaciteAccueilRestauration"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.augmentationCapaciteAccueilRestauration}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"augmentationCapaciteAccueilRestaurationPlaces"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.augmentationCapaciteAccueilRestaurationPlaces}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"augmentationCapaciteAccueilRestaurationPrecisions"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.augmentationCapaciteAccueilRestaurationPrecisions}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"statut"}
        getCellBgColor={getCellBgColor}
        handleOrder={handleOrder}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.statut}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"motifRefus"}
        getCellBgColor={getCellBgColor}
        order={order}
      >
        {STATS_DEMANDES_COLUMNS.motifRefus}
      </ConditionalTh>
      {displayPilotageColumns && (
        <>
          <ConditionalTh
            colonneFilters={colonneFilters}
            colonne={"pilotageCapacite"}
            getCellBgColor={getCellBgColor}
            order={order}
            overrideTooltip={(tooltip) => tooltip.replace("{0}", currentRS)}
          >
            {STATS_DEMANDES_COLUMNS.pilotageCapacite.replace("{0}", currentRS)}
            <TooltipIcon
              ml="1"
              mt="1px"
              label={
                <>
                  <Text>Capacité théorique issue d'Affelnet pour la rentrée 2024, voie scolaire</Text>
                  <Text>Cliquer pour plus d'infos.</Text>
                </>
              }
              onClick={() => openGlossaire("capacite")}
              placement={"bottom-end"}
            />
          </ConditionalTh>
          <ConditionalTh
            colonneFilters={colonneFilters}
            colonne={"pilotageEffectif"}
            getCellBgColor={getCellBgColor}
            order={order}
            overrideTooltip={(tooltip) => tooltip.replace("{0}", currentRS)}
          >
            {STATS_DEMANDES_COLUMNS.pilotageEffectif.replace("{0}", currentRS)}
            <TooltipIcon
              ml="1"
              mt="1px"
              label={
                <>
                  <Text>
                    Effectif en entrée de formation issue du Constat de Rentrée 2024,
                    comptant uniquement les élèves en voie scolaire
                  </Text>
                  <Text>Cliquer pour plus d'infos.</Text>
                </>
              }
              onClick={() => openGlossaire("effectif-en-entree")}
              placement={"bottom-end"}
            />
          </ConditionalTh>
          <ConditionalTh
            colonneFilters={colonneFilters}
            colonne={"pilotageTauxRemplissage"}
            overrideTooltip={(tooltip) => tooltip.replace("{0}", currentRS)}
            maxW={200}
            getCellBgColor={getCellBgColor}
            order={order}
          >
            {STATS_DEMANDES_COLUMNS.pilotageTauxRemplissage.replace("{0}", currentRS)}
            <TooltipIcon
              ml="1"
              mt="1px"
              label={
                <>
                  <Text>
                    Taux de remplissage par rapport à la capacité théorique
                    d'Affelnet pour la rentrée 2024, voie scolaire
                  </Text>
                  <Text>Cliquer pour plus d'infos.</Text>
                </>
              }
              onClick={() => openGlossaire("taux-de-remplissage")}
              placement={"bottom-end"}
            />
          </ConditionalTh>
          <ConditionalTh
            colonneFilters={colonneFilters}
            colonne={"pilotageTauxPression"}
            overrideTooltip={(tooltip) => tooltip.replace("{0}", currentRS)}
            maxW={200}
            getCellBgColor={getCellBgColor}
            order={order}
          >
            {STATS_DEMANDES_COLUMNS.pilotageTauxPression.replace("{0}", currentRS)}
            <TooltipIcon
              ml="1"
              mt="1px"
              label={
                <>
                  <Text>
                    Taux de pression (ou de demande dans le cas des BTS)
                    issue d'Affelnet pour la rentrée 2024, voie scolaire
                  </Text>
                  <Text>Cliquer pour plus d'infos.</Text>
                </>
              }
              onClick={() => openGlossaire("taux-de-pression")}
              placement={"bottom-end"}
            />
          </ConditionalTh>
          <ConditionalTh
            colonneFilters={colonneFilters}
            colonne={"pilotageTauxDemande"}
            overrideTooltip={(tooltip) => tooltip.replace("{0}", currentRS)}
            maxW={200}
            getCellBgColor={getCellBgColor}
            order={order}
          >
            {STATS_DEMANDES_COLUMNS.pilotageTauxDemande.replace("{0}", currentRS)}
            <TooltipIcon
              ml="1"
              mt="1px"
              label={
                <Box>
                  <Text>Le ratio entre le nombre de voeux et la capacité de la formation dans l'établissement.</Text>
                  <Text>Cliquez pour plus d'infos.</Text>
                </Box>
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
