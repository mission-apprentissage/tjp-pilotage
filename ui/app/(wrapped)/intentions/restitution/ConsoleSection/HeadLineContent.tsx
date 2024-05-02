import { Box, chakra, Th } from "@chakra-ui/react";
import { CSSProperties } from "react";

import { TauxPressionScale } from "@/app/(wrapped)/components/TauxPressionScale";
import { STATS_DEMANDES_COLUMNS } from "@/app/(wrapped)/intentions/restitution/STATS_DEMANDES_COLUMN";
import { OrderDemandesRestitutionIntentions } from "@/app/(wrapped)/intentions/restitution/types";
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
  }: {
    className?: string;
    style?: CSSProperties;
    children: React.ReactNode;
    colonneFilters: (keyof typeof STATS_DEMANDES_COLUMNS)[];
    colonne: keyof typeof STATS_DEMANDES_COLUMNS;
    onClick?: (column: OrderDemandesRestitutionIntentions["orderBy"]) => void;
    isNumeric?: boolean;
  }) => {
    if (colonneFilters.includes(colonne))
      return (
        <Th
          className={className}
          style={style}
          isNumeric={isNumeric}
          minW={170}
          p={2}
          cursor={onClick ? "pointer" : "default"}
          whiteSpace="normal"
          onClick={() =>
            onClick &&
            onClick(colonne as OrderDemandesRestitutionIntentions["orderBy"])
          }
        >
          {children}
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
  order: OrderDemandesRestitutionIntentions;
  handleOrder: (column: OrderDemandesRestitutionIntentions["orderBy"]) => void;
  colonneFilters: (keyof typeof STATS_DEMANDES_COLUMNS)[];
  getCellColor: (column: keyof typeof STATS_DEMANDES_COLUMNS) => string;
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
        {STATS_DEMANDES_COLUMNS.libelleEtablissement}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"commune"}
        onClick={handleOrder}
        left={300}
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
        colonne={"niveauDiplome"}
        onClick={handleOrder}
        bgColor={getCellColor("niveauDiplome")}
      >
        <OrderIcon {...order} column="niveauDiplome" />
        {STATS_DEMANDES_COLUMNS.niveauDiplome}
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
        colonne={"libelleColoration"}
        onClick={handleOrder}
        bgColor={getCellColor("libelleColoration")}
      >
        <OrderIcon {...order} column="libelleColoration" />
        {STATS_DEMANDES_COLUMNS.libelleColoration}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"libelleFCIL"}
        onClick={handleOrder}
        bgColor={getCellColor("libelleFCIL")}
      >
        <OrderIcon {...order} column="libelleFCIL" />
        {STATS_DEMANDES_COLUMNS.libelleFCIL}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"amiCma"}
        onClick={handleOrder}
        bgColor={getCellColor("amiCma")}
      >
        <OrderIcon {...order} column="amiCma" />
        {STATS_DEMANDES_COLUMNS.amiCma}
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
        pb={4}
        isNumeric
        bgColor={getCellColor("positionQuadrant")}
      >
        {STATS_DEMANDES_COLUMNS.positionQuadrant}
        <TooltipIcon
          ml="1"
          label="Positionnement du point de la formation dans le quadrant par rapport aux moyennes régionales des taux d'emploi et de poursuite d'études appliquées au niveau de diplôme."
        />
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
        {STATS_DEMANDES_COLUMNS.tauxInsertionRegional}
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
        minW={250}
        maxW={250}
        bgColor={getCellColor("tauxPoursuiteRegional")}
      >
        <OrderIcon {...order} column="tauxPoursuiteRegional" />
        {STATS_DEMANDES_COLUMNS.tauxPoursuiteRegional}
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
        minW={220}
        maxW={220}
        bgColor={getCellColor("tauxDevenirFavorableRegional")}
      >
        <OrderIcon {...order} column="tauxDevenirFavorableRegional" />
        {STATS_DEMANDES_COLUMNS.tauxDevenirFavorableRegional}
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
        minW={170}
        maxW={170}
        bgColor={getCellColor("tauxPressionRegional")}
      >
        <OrderIcon {...order} column="tauxPressionRegional" />
        {STATS_DEMANDES_COLUMNS.tauxPressionRegional}
        <TooltipIcon
          ml="1"
          label={
            <>
              <Box>
                Le ratio entre le nombre de premiers voeux et la capacité de la
                formation au niveau régional.
              </Box>
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
        {STATS_DEMANDES_COLUMNS.nbEtablissement}
        <TooltipIcon
          ml="1"
          label="Le nombre d'établissement dispensant la formation dans la région."
        />
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
        colonne={"achatEquipement"}
        onClick={handleOrder}
        bgColor={getCellColor("achatEquipement")}
      >
        <OrderIcon {...order} column="achatEquipement" />
        {STATS_DEMANDES_COLUMNS.achatEquipement}
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
        <OrderIcon
          {...order}
          column="augmentationCapaciteAccueilHebergementPlaces"
        />
        {STATS_DEMANDES_COLUMNS.augmentationCapaciteAccueilHebergementPlaces}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"augmentationCapaciteAccueilHebergementPrecisions"}
        onClick={handleOrder}
        bgColor={getCellColor(
          "augmentationCapaciteAccueilHebergementPrecisions"
        )}
      >
        <OrderIcon
          {...order}
          column="augmentationCapaciteAccueilHebergementPrecisions"
        />
        {
          STATS_DEMANDES_COLUMNS.augmentationCapaciteAccueilHebergementPrecisions
        }
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"augmentationCapaciteAccueilRestauration"}
        onClick={handleOrder}
        bgColor={getCellColor("augmentationCapaciteAccueilRestauration")}
      >
        <OrderIcon
          {...order}
          column="augmentationCapaciteAccueilRestauration"
        />
        {STATS_DEMANDES_COLUMNS.augmentationCapaciteAccueilRestauration}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"augmentationCapaciteAccueilRestaurationPlaces"}
        onClick={handleOrder}
        bgColor={getCellColor("augmentationCapaciteAccueilRestaurationPlaces")}
      >
        <OrderIcon
          {...order}
          column="augmentationCapaciteAccueilRestaurationPlaces"
        />
        {STATS_DEMANDES_COLUMNS.augmentationCapaciteAccueilRestaurationPlaces}
      </ConditionalTh>
      <ConditionalTh
        colonneFilters={colonneFilters}
        colonne={"augmentationCapaciteAccueilRestaurationPrecisions"}
        onClick={handleOrder}
        bgColor={getCellColor(
          "augmentationCapaciteAccueilRestaurationPrecisions"
        )}
      >
        <OrderIcon
          {...order}
          column="augmentationCapaciteAccueilRestaurationPrecisions"
        />
        {
          STATS_DEMANDES_COLUMNS.augmentationCapaciteAccueilRestaurationPrecisions
        }
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
    </>
  );
};