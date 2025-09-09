import { chakra, Td, Tooltip } from "@chakra-ui/react";
import type { TypeDemandeType } from "shared/enum/demandeTypeEnum";
import { SecteurEnum } from "shared/enum/secteurEnum";
import { getMillesimeFromCampagne } from "shared/time/millesimes";
import { unEscapeString } from "shared/utils/escapeString";

import type { Demande , DEMANDES_COLUMNS_KEYS } from "@/app/(wrapped)/demandes/restitution/types";
import type { AnneeCampagneMotifDemande, MotifDemandeLabel } from "@/app/(wrapped)/demandes/utils/motifDemandeUtils";
import { getMotifDemandeLabel } from "@/app/(wrapped)/demandes/utils/motifDemandeUtils";
import type { MotifRefusLabel } from "@/app/(wrapped)/demandes/utils/motifRefusDemandeUtils";
import { getMotifRefusLabel } from "@/app/(wrapped)/demandes/utils/motifRefusDemandeUtils";
import { formatStatut } from "@/app/(wrapped)/demandes/utils/statutUtils";
import { getTypeDemandeLabel } from "@/app/(wrapped)/demandes/utils/typeDemandeUtils";
import { BadgesFormationSpecifique } from "@/components/BadgesFormationSpecifique";
import { GraphWrapper } from "@/components/GraphWrapper";
import { TableBadge } from "@/components/TableBadge";
import { formatCommuneLibelleWithCodeDepartement, formatLibellesColoration, formatMillesime } from "@/utils/formatLibelle";
import { formatNumber,formatNumberToMonetaryString, formatNumberToString, formatPercentageFixedDigits } from "@/utils/formatUtils";
import { getTauxPressionStyle } from "@/utils/getBgScale";

import { getLeftOffset,isColonneSticky, isColonneVisible } from "./utils";


const formatBooleanValue = (value?: boolean) => (value ? "Oui" : "Non");

const handleMotifDemandeLabel = ({
  motifs,
  anneeCampagne,
  autreMotif,
}: {
  motifs?: string[];
  anneeCampagne?: string;
  autreMotif?: string;
}) => {
  if (!motifs || motifs.length === 0) return undefined;
  const formattedMotifs = motifs?.map((motif) =>
    motif === "autre"
      ? `Autre : ${unEscapeString(autreMotif)}`
      : getMotifDemandeLabel({
        motif: motif as MotifDemandeLabel,
        anneeCampagne: anneeCampagne as AnneeCampagneMotifDemande,
      })
  );
  return `(${formattedMotifs.length}) ${formattedMotifs?.join(", ")}`;
};

const handleMotifRefusLabel = ({
  motifsRefus,
  autreMotifRefus,
}: {
  motifsRefus?: string[];
  autreMotifRefus?: string;
}) => {
  if (!motifsRefus || motifsRefus.length === 0) return undefined;
  const formattedMotifs = motifsRefus?.map((motif) =>
    motif === "autre" ? `Autre : ${unEscapeString(autreMotifRefus)}` : getMotifRefusLabel(motif as MotifRefusLabel)
  );
  return `(${formattedMotifs.length}) ${formattedMotifs?.join(", ")}`;
};

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
    colonneFilters: Array<DEMANDES_COLUMNS_KEYS>;
    colonne: DEMANDES_COLUMNS_KEYS;
    stickyColonnes: Array<DEMANDES_COLUMNS_KEYS>;
    getCellBgColor: (column: DEMANDES_COLUMNS_KEYS) => string;
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
          border={"none"}
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

export const LineContent = ({
  demande,
  colonneFilters,
  getCellBgColor,
  stickyColonnes,
  displayPilotageColumns,
}: {
  demande: Demande;
  colonneFilters: Array<DEMANDES_COLUMNS_KEYS>;
  getCellBgColor: (column: DEMANDES_COLUMNS_KEYS) => string;
  stickyColonnes: Array<DEMANDES_COLUMNS_KEYS>;
  displayPilotageColumns: boolean;
}) => {
  return (
    <>
      <ConditionalTd
        colonne={"libelleEtablissement"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.libelleEtablissement}
      </ConditionalTd>
      <ConditionalTd
        colonne={"commune"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {formatCommuneLibelleWithCodeDepartement({
          commune: demande.commune,
          codeDepartement: demande.codeDepartement,
        })}
      </ConditionalTd>
      <ConditionalTd
        colonne={"libelleRegion"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.libelleRegion}
      </ConditionalTd>
      <ConditionalTd
        colonne={"libelleAcademie"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.libelleAcademie}
      </ConditionalTd>
      <ConditionalTd
        colonne={"secteur"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.secteur === SecteurEnum["PU"] ? "Public" : "Privé"}
      </ConditionalTd>
      <ConditionalTd
        colonne={"libelleNsf"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.libelleNsf}
      </ConditionalTd>
      <ConditionalTd
        colonne={"libelleFormation"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.libelleFormation}
      </ConditionalTd>
      <ConditionalTd
        colonne={"formationSpecifique"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        <BadgesFormationSpecifique formationSpecifique={demande.formationSpecifique} />
      </ConditionalTd>
      <ConditionalTd
        colonne={"libelleNiveauDiplome"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.libelleNiveauDiplome}
      </ConditionalTd>
      <ConditionalTd
        colonne={"typeDemande"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {getTypeDemandeLabel(demande.typeDemande as TypeDemandeType)}
      </ConditionalTd>
      <ConditionalTd
        colonne={"motif"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
        textOverflow={"ellipsis"}
        isTruncated={true}
      >
        {handleMotifDemandeLabel({
          motifs: demande.motif,
          autreMotif: demande.autreMotif,
          anneeCampagne: demande.campagne.annee,
        })}
      </ConditionalTd>
      <ConditionalTd
        colonne={"differenceCapaciteScolaire"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
        isNumeric
      >
        {demande.differenceCapaciteScolaire ?? 0}
      </ConditionalTd>
      <ConditionalTd
        colonne={"differenceCapaciteApprentissage"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
        isNumeric
      >
        {demande.differenceCapaciteApprentissage ?? 0}
      </ConditionalTd>
      <ConditionalTd
        colonne={"differenceCapaciteScolaireColoree"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
        isNumeric
      >
        {demande.differenceCapaciteScolaireColoree ?? 0}
      </ConditionalTd>
      <ConditionalTd
        colonne={"differenceCapaciteApprentissageColoree"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
        isNumeric
      >
        {demande.differenceCapaciteApprentissageColoree ?? 0}
      </ConditionalTd>
      <ConditionalTd
        colonne={"libelleColoration"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {formatLibellesColoration(demande)}
      </ConditionalTd>
      <ConditionalTd
        colonne={"libelleFCIL"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.libelleFCIL}
      </ConditionalTd>
      <ConditionalTd
        colonne={"amiCma"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {formatBooleanValue(demande.amiCma)}
      </ConditionalTd>
      <ConditionalTd
        colonne={"amiCmaValide"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {formatBooleanValue(demande.amiCmaValide)}
      </ConditionalTd>
      <ConditionalTd
        colonne={"amiCmaEnCoursValidation"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {formatBooleanValue(demande.amiCmaEnCoursValidation)}
      </ConditionalTd>
      <ConditionalTd
        colonne={"amiCmaValideAnnee"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.amiCmaValideAnnee}
      </ConditionalTd>
      <ConditionalTd
        colonne={"filiereCmq"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.filiereCmq}
      </ConditionalTd>
      <ConditionalTd
        colonne={"nomCmq"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.nomCmq}
      </ConditionalTd>
      <ConditionalTd
        colonne={"inspecteurReferent"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.inspecteurReferent}
      </ConditionalTd>
      <ConditionalTd
        colonne={"partenaireEconomique1"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.partenaireEconomique1}
      </ConditionalTd>
      <ConditionalTd
        colonne={"partenaireEconomique2"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.partenaireEconomique2}
      </ConditionalTd>
      <ConditionalTd
        colonne={"commentaire"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
        textOverflow={"ellipsis"}
        isTruncated={true}
      >
        {demande.commentaire}
      </ConditionalTd>
      <ConditionalTd
        colonne={"numero"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.numero}
      </ConditionalTd>
      <ConditionalTd
        colonne={"positionQuadrant"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
        textAlign="center"
      >
        <Tooltip
          label={`Position dans le quadrant (millésimes ${formatMillesime(getMillesimeFromCampagne(demande.campagne.annee))})`}
          placement="top"
        >
          {demande.positionQuadrant}
        </Tooltip>
      </ConditionalTd>
      <ConditionalTd
        colonne={"tauxInsertionRegional"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
        textAlign="center"
      >
        <GraphWrapper
          value={demande.tauxInsertionRegional}
          millesime={getMillesimeFromCampagne(demande.campagne.annee)}
        />
      </ConditionalTd>
      <ConditionalTd
        colonne={"tauxPoursuiteRegional"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
        textAlign="center"
      >
        <GraphWrapper
          value={demande.tauxPoursuiteRegional}
          millesime={getMillesimeFromCampagne(demande.campagne.annee)}
        />
      </ConditionalTd>
      <ConditionalTd
        colonne={"tauxDevenirFavorableRegional"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
        textAlign="center"
      >
        <GraphWrapper
          value={demande.tauxDevenirFavorableRegional}
          millesime={getMillesimeFromCampagne(demande.campagne.annee)}
        />
      </ConditionalTd>
      <ConditionalTd
        colonne={"tauxPressionRegional"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
        textAlign="center"
      >
        <TableBadge sx={
          getTauxPressionStyle(
            demande.tauxPressionRegional !== undefined ?
              formatNumber(demande.tauxPressionRegional, 2) :
              undefined
          )
        }>
          {formatNumberToString(demande.tauxPressionRegional, 2, "-")}
        </TableBadge>
      </ConditionalTd>
      <ConditionalTd
        colonne={"nbEtablissement"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
        isNumeric
      >
        {demande.nbEtablissement}
      </ConditionalTd>
      <ConditionalTd
        colonne={"nbRecrutementRH"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.nbRecrutementRH}
      </ConditionalTd>
      <ConditionalTd
        colonne={"nbReconversionRH"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.nbReconversionRH}
      </ConditionalTd>
      <ConditionalTd
        colonne={"nbProfesseurAssocieRH"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.nbProfesseurAssocieRH}
      </ConditionalTd>
      <ConditionalTd
        colonne={"nbFormationRH"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.nbFormationRH}
      </ConditionalTd>
      <ConditionalTd
        colonne={"travauxAmenagement"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {formatBooleanValue(demande.travauxAmenagement)}
      </ConditionalTd>
      <ConditionalTd
        colonne={"travauxAmenagementCout"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
        isNumeric
      >
        {formatNumberToMonetaryString(demande.travauxAmenagementCout, 0, "-")}
      </ConditionalTd>
      <ConditionalTd
        colonne={"travauxAmenagementDescription"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.travauxAmenagementDescription}
      </ConditionalTd>
      <ConditionalTd
        colonne={"achatEquipement"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {formatBooleanValue(demande.achatEquipement)}
      </ConditionalTd>
      <ConditionalTd
        colonne={"achatEquipementCout"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
        isNumeric
      >
        {formatNumberToMonetaryString(demande.achatEquipementCout, 0, "-")}
      </ConditionalTd>
      <ConditionalTd
        colonne={"achatEquipementDescription"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.achatEquipementDescription}
      </ConditionalTd>
      <ConditionalTd
        colonne={"augmentationCapaciteAccueilHebergement"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {formatBooleanValue(demande.augmentationCapaciteAccueilHebergement)}
      </ConditionalTd>
      <ConditionalTd
        colonne={"augmentationCapaciteAccueilHebergementPlaces"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.augmentationCapaciteAccueilHebergementPlaces}
      </ConditionalTd>
      <ConditionalTd
        colonne={"augmentationCapaciteAccueilHebergementPrecisions"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.augmentationCapaciteAccueilHebergementPrecisions}
      </ConditionalTd>
      <ConditionalTd
        colonne={"augmentationCapaciteAccueilRestauration"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {formatBooleanValue(demande.augmentationCapaciteAccueilRestauration)}
      </ConditionalTd>
      <ConditionalTd
        colonne={"augmentationCapaciteAccueilRestaurationPlaces"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.augmentationCapaciteAccueilRestaurationPlaces}
      </ConditionalTd>
      <ConditionalTd
        colonne={"augmentationCapaciteAccueilRestaurationPrecisions"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {demande.augmentationCapaciteAccueilRestaurationPrecisions}
      </ConditionalTd>
      <ConditionalTd
        colonne={"statut"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {formatStatut(demande.statut)}
      </ConditionalTd>
      <ConditionalTd
        colonne={"motifRefus"}
        colonneFilters={colonneFilters}
        getCellBgColor={getCellBgColor}
        stickyColonnes={stickyColonnes}
      >
        {handleMotifRefusLabel({
          motifsRefus: demande.motifRefus,
          autreMotifRefus: demande.autreMotifRefus,
        })}
      </ConditionalTd>
      {
        displayPilotageColumns && (
          <>
            <ConditionalTd
              colonne={"pilotageCapacite"}
              colonneFilters={colonneFilters}
              getCellBgColor={getCellBgColor}
              stickyColonnes={stickyColonnes}
            >
              {demande.pilotageCapacite}
            </ConditionalTd>
            <ConditionalTd
              colonne={"pilotageEffectif"}
              colonneFilters={colonneFilters}
              getCellBgColor={getCellBgColor}
              stickyColonnes={stickyColonnes}
              isNumeric
            >
              {demande.pilotageEffectif}
            </ConditionalTd>
            <ConditionalTd
              colonne={"pilotageTauxRemplissage"}
              colonneFilters={colonneFilters}
              getCellBgColor={getCellBgColor}
              stickyColonnes={stickyColonnes}
              textAlign={"center"}
            >
              {formatPercentageFixedDigits(demande.pilotageTauxRemplissage, 1, "")}
            </ConditionalTd>
            <ConditionalTd
              colonne={"pilotageTauxPression"}
              colonneFilters={colonneFilters}
              getCellBgColor={getCellBgColor}
              stickyColonnes={stickyColonnes}
              textAlign={"center"}
            >
              {formatNumberToString(demande.pilotageTauxPression, 2, "-")}
            </ConditionalTd>
            <ConditionalTd
              colonne={"pilotageTauxDemande"}
              colonneFilters={colonneFilters}
              getCellBgColor={getCellBgColor}
              stickyColonnes={stickyColonnes}
              textAlign={"center"}
            >
              {formatNumberToString(demande.pilotageTauxDemande, 2, "-") }
            </ConditionalTd>
          </>
        )
      }
    </>
  );
};
