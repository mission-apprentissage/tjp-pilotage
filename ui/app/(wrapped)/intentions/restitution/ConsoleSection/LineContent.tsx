import { chakra, Td } from "@chakra-ui/react";

import type { STATS_DEMANDES_COLUMNS } from "@/app/(wrapped)/intentions/restitution/STATS_DEMANDES_COLUMN";
import type { DemandesRestitutionIntentions } from "@/app/(wrapped)/intentions/restitution/types";
import type { MotifCampagne, MotifLabel } from "@/app/(wrapped)/intentions/utils/motifDemandeUtils";
import { getMotifLabel } from "@/app/(wrapped)/intentions/utils/motifDemandeUtils";
import type { MotifRefusLabel } from "@/app/(wrapped)/intentions/utils/motifRefusDemandeUtils";
import { getMotifRefusLabel } from "@/app/(wrapped)/intentions/utils/motifRefusDemandeUtils";
import { formatStatut } from "@/app/(wrapped)/intentions/utils/statutUtils";
import { getTypeDemandeLabel } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";
import { BadgeActionPrioritaire } from "@/components/BadgeActionPrioritaire";
import { BadgesFormationSpecifique } from "@/components/BadgesFormationSpecifique";
import { GraphWrapper } from "@/components/GraphWrapper";
import { TableBadge } from "@/components/TableBadge";
import { formatCommuneLibelleWithCodeDepartement } from "@/utils/formatLibelle";
import { formatNumber } from "@/utils/formatUtils";
import { getTauxPressionStyle } from "@/utils/getBgScale";

const formatBooleanValue = (value?: boolean) => (value ? "Oui" : "Non");

const handleMotifLabel = ({
  motifs,
  autreMotif,
  campagne,
}: {
  motifs?: string[];
  campagne?: string;
  autreMotif?: string;
}) => {
  if (!motifs || motifs.length === 0) return undefined;
  const formattedMotifs = motifs?.map((motif) =>
    motif === "autre"
      ? `Autre : ${autreMotif}`
      : getMotifLabel({
          motif: motif as MotifLabel,
          campagne: campagne as MotifCampagne,
        }),
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
    motif === "autre" ? `Autre : ${autreMotifRefus}` : getMotifRefusLabel(motif as MotifRefusLabel),
  );
  return `(${formattedMotifs.length}) ${formattedMotifs?.join(", ")}`;
};

const ConditionalTd = chakra(
  ({
    className,
    colonneFilters,
    colonne,
    children,
    isNumeric = false,
  }: {
    className?: string;
    colonneFilters: (keyof typeof STATS_DEMANDES_COLUMNS)[];
    colonne: keyof typeof STATS_DEMANDES_COLUMNS;
    children: React.ReactNode;
    isNumeric?: boolean;
  }) => {
    if (colonneFilters.includes(colonne))
      return (
        <Td
          className={className}
          isNumeric={isNumeric}
          border={"none"}
          whiteSpace={"normal"}
          _groupHover={{ bgColor: "blueecume.850 !important" }}
        >
          {children}
        </Td>
      );
    return null;
  },
);

export const LineContent = ({
  demande,
  campagne,
  colonneFilters,
  getCellColor,
}: {
  demande: DemandesRestitutionIntentions["demandes"][0];
  campagne?: string;
  colonneFilters: (keyof typeof STATS_DEMANDES_COLUMNS)[];
  getCellColor: (column: keyof typeof STATS_DEMANDES_COLUMNS) => string;
}) => {
  return (
    <>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"libelleEtablissement"}
        minW={300}
        maxW={300}
        left={0}
        position="sticky"
        zIndex={1}
        bgColor={getCellColor("libelleEtablissement")}
      >
        {demande.libelleEtablissement}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"commune"}
        left={colonneFilters.includes("libelleEtablissement") ? 300 : 0}
        position="sticky"
        zIndex={1}
        boxShadow={"inset -2px 0px 0px 0px #E2E8F0"}
        bgColor={getCellColor("commune")}
      >
        {formatCommuneLibelleWithCodeDepartement({
          commune: demande.commune,
          codeDepartement: demande.codeDepartement,
        })}
      </ConditionalTd>
      <ConditionalTd colonneFilters={colonneFilters} colonne={"libelleRegion"} bgColor={getCellColor("libelleRegion")}>
        {demande.libelleRegion}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"libelleAcademie"}
        bgColor={getCellColor("libelleAcademie")}
      >
        {demande.libelleAcademie}
      </ConditionalTd>
      <ConditionalTd colonneFilters={colonneFilters} colonne={"secteur"} bgColor={getCellColor("secteur")}>
        {demande.secteur === "PU" ? "Public" : "Privé"}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"libelleNsf"}
        minW={300}
        maxW={300}
        bgColor={getCellColor("libelleNsf")}
      >
        {demande.libelleNsf}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"libelleFormation"}
        minW={300}
        maxW={300}
        bgColor={getCellColor("libelleFormation")}
      >
        {demande.libelleFormation}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"formationSpecifique"}
        minW={300}
        maxW={300}
        bgColor={getCellColor("formationSpecifique")}
      >
        <BadgesFormationSpecifique formationSpecifique={demande.formationSpecifique} />
      </ConditionalTd>
      <ConditionalTd colonneFilters={colonneFilters} colonne={"niveauDiplome"} bgColor={getCellColor("niveauDiplome")}>
        {demande.niveauDiplome}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"typeDemande"}
        pr="0"
        py="1"
        bgColor={getCellColor("typeDemande")}
      >
        {getTypeDemandeLabel(demande.typeDemande)}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"motif"}
        minW={400}
        maxW={400}
        textOverflow={"ellipsis"}
        isTruncated={true}
        bgColor={getCellColor("motif")}
      >
        {handleMotifLabel({
          motifs: demande.motif,
          autreMotif: demande.autreMotif,
          campagne: campagne,
        })}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"differenceCapaciteScolaire"}
        isNumeric
        bgColor={getCellColor("differenceCapaciteScolaire")}
      >
        {demande.differenceCapaciteScolaire ?? 0}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"differenceCapaciteApprentissage"}
        isNumeric
        bgColor={getCellColor("differenceCapaciteApprentissage")}
      >
        {demande.differenceCapaciteApprentissage ?? 0}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"differenceCapaciteScolaireColoree"}
        isNumeric
        bgColor={getCellColor("capaciteScolaireColoree")}
      >
        {demande.differenceCapaciteScolaireColoree ?? 0}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"differenceCapaciteApprentissageColoree"}
        isNumeric
        bgColor={getCellColor("differenceCapaciteApprentissageColoree")}
      >
        {demande.differenceCapaciteApprentissageColoree ?? 0}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"libelleColoration"}
        minW={300}
        maxW={300}
        bgColor={getCellColor("libelleColoration")}
      >
        {demande.libelleColoration}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"libelleFCIL"}
        minW={300}
        maxW={300}
        bgColor={getCellColor("libelleFCIL")}
      >
        {demande.libelleFCIL}
      </ConditionalTd>
      <ConditionalTd colonneFilters={colonneFilters} colonne={"amiCma"} bgColor={getCellColor("amiCma")}>
        {formatBooleanValue(demande.amiCma)}
      </ConditionalTd>
      <ConditionalTd colonneFilters={colonneFilters} colonne={"amiCmaValide"} bgColor={getCellColor("amiCmaValide")}>
        {formatBooleanValue(demande.amiCmaValide)}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"amiCmaEnCoursValidation"}
        bgColor={getCellColor("amiCmaEnCoursValidation")}
      >
        {formatBooleanValue(demande.amiCmaEnCoursValidation)}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"amiCmaValideAnnee"}
        bgColor={getCellColor("amiCmaValideAnnee")}
      >
        {demande.amiCmaValideAnnee}
      </ConditionalTd>
      <ConditionalTd colonneFilters={colonneFilters} colonne={"filiereCmq"} bgColor={getCellColor("filiereCmq")}>
        {demande.filiereCmq}
      </ConditionalTd>
      <ConditionalTd colonneFilters={colonneFilters} colonne={"nomCmq"} bgColor={getCellColor("nomCmq")}>
        {demande.nomCmq}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"inspecteurReferent"}
        bgColor={getCellColor("inspecteurReferent")}
      >
        {demande.inspecteurReferent}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"partenaireEconomique1"}
        bgColor={getCellColor("partenaireEconomique1")}
      >
        {demande.partenaireEconomique1}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"partenaireEconomique2"}
        bgColor={getCellColor("partenaireEconomique2")}
      >
        {demande.partenaireEconomique2}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"commentaire"}
        minW={400}
        maxW={400}
        textOverflow={"ellipsis"}
        isTruncated={true}
        bgColor={getCellColor("commentaire")}
      >
        {demande.commentaire}
      </ConditionalTd>
      <ConditionalTd colonneFilters={colonneFilters} colonne={"numero"} bgColor={getCellColor("numero")}>
        {demande.numero}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        isNumeric
        colonne={"positionQuadrant"}
        bgColor={getCellColor("positionQuadrant")}
      >
        {demande.positionQuadrant}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"tauxInsertionRegional"}
        textAlign="center"
        bgColor={getCellColor("tauxInsertionRegional")}
      >
        <GraphWrapper value={demande.tauxInsertionRegional} />
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"tauxPoursuiteRegional"}
        textAlign="center"
        bgColor={getCellColor("tauxPoursuiteRegional")}
      >
        <GraphWrapper value={demande.tauxPoursuiteRegional} />
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"tauxDevenirFavorableRegional"}
        textAlign="center"
        bgColor={getCellColor("tauxDevenirFavorableRegional")}
      >
        <GraphWrapper value={demande.tauxDevenirFavorableRegional} />
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"tauxPressionRegional"}
        textAlign="center"
        bgColor={getCellColor("tauxPressionRegional")}
      >
        <TableBadge sx={getTauxPressionStyle(demande.tauxPressionRegional)}>
          {formatNumber(demande.tauxPressionRegional, 2) || "-"}
        </TableBadge>
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"nbEtablissement"}
        isNumeric
        bgColor={getCellColor("nbEtablissement")}
      >
        {demande.nbEtablissement}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"nbRecrutementRH"}
        bgColor={getCellColor("nbRecrutementRH")}
      >
        {demande.nbRecrutementRH}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"nbReconversionRH"}
        bgColor={getCellColor("nbReconversionRH")}
      >
        {demande.nbReconversionRH}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"nbProfesseurAssocieRH"}
        bgColor={getCellColor("nbProfesseurAssocieRH")}
      >
        {demande.nbProfesseurAssocieRH}
      </ConditionalTd>
      <ConditionalTd colonneFilters={colonneFilters} colonne={"nbFormationRH"} bgColor={getCellColor("nbFormationRH")}>
        {demande.nbFormationRH}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"travauxAmenagement"}
        bgColor={getCellColor("travauxAmenagement")}
      >
        {formatBooleanValue(demande.travauxAmenagement)}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"travauxAmenagementCout"}
        bgColor={getCellColor("travauxAmenagementCout")}
        isNumeric
      >
        {demande.travauxAmenagementCout !== undefined ? `${demande.travauxAmenagementCout}€` : "-"}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"travauxAmenagementDescription"}
        bgColor={getCellColor("travauxAmenagementDescription")}
      >
        {demande.travauxAmenagementDescription}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"achatEquipement"}
        bgColor={getCellColor("achatEquipement")}
      >
        {formatBooleanValue(demande.achatEquipement)}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"achatEquipementCout"}
        bgColor={getCellColor("achatEquipementCout")}
        isNumeric
      >
        {demande.achatEquipementCout !== undefined ? `${demande.achatEquipementCout}€` : "-"}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"achatEquipementDescription"}
        bgColor={getCellColor("achatEquipementDescription")}
      >
        {demande.achatEquipementDescription}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"augmentationCapaciteAccueilHebergement"}
        bgColor={getCellColor("augmentationCapaciteAccueilHebergement")}
      >
        {formatBooleanValue(demande.augmentationCapaciteAccueilHebergement)}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"augmentationCapaciteAccueilHebergementPlaces"}
        bgColor={getCellColor("augmentationCapaciteAccueilHebergementPlaces")}
      >
        {demande.augmentationCapaciteAccueilHebergementPlaces}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"augmentationCapaciteAccueilHebergementPrecisions"}
        bgColor={getCellColor("augmentationCapaciteAccueilHebergementPrecisions")}
      >
        {demande.augmentationCapaciteAccueilHebergementPrecisions}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"augmentationCapaciteAccueilRestauration"}
        bgColor={getCellColor("augmentationCapaciteAccueilRestauration")}
      >
        {formatBooleanValue(demande.augmentationCapaciteAccueilRestauration)}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"augmentationCapaciteAccueilRestaurationPlaces"}
        bgColor={getCellColor("augmentationCapaciteAccueilRestaurationPlaces")}
      >
        {demande.augmentationCapaciteAccueilRestaurationPlaces}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"augmentationCapaciteAccueilRestaurationPrecisions"}
        bgColor={getCellColor("augmentationCapaciteAccueilRestaurationPrecisions")}
      >
        {demande.augmentationCapaciteAccueilRestaurationPrecisions}
      </ConditionalTd>
      <ConditionalTd colonneFilters={colonneFilters} colonne={"statut"} bgColor={getCellColor("statut")}>
        {formatStatut(demande.statut)}
      </ConditionalTd>
      <ConditionalTd colonneFilters={colonneFilters} colonne={"motifRefus"} bgColor={getCellColor("motifRefus")}>
        {handleMotifRefusLabel({
          motifsRefus: demande.motifRefus,
          autreMotifRefus: demande.autreMotifRefus,
        })}
      </ConditionalTd>
    </>
  );
};
