import { chakra, Td } from "@chakra-ui/react";

import { STATS_DEMANDES_COLUMNS } from "@/app/(wrapped)/intentions/restitution/STATS_DEMANDES_COLUMN";

import { GraphWrapper } from "../../../../../components/GraphWrapper";
import { TableBadge } from "../../../../../components/TableBadge";
import { getTauxPressionStyle } from "../../../../../utils/getBgScale";
import {
  getMotifLabel,
  MotifCampagne,
  MotifLabel,
} from "../../utils/motifDemandeUtils";
import { getTypeDemandeLabel } from "../../utils/typeDemandeUtils";
import { DemandesRestitutionIntentions } from "../types";

const handleMotifLabel = ({
  motifs,
  autreMotif,
  campagne,
}: {
  motifs?: string[];
  campagne?: string;
  autreMotif?: string;
}) => {
  if (!motifs) return undefined;
  const formattedMotifs = motifs?.map((motif) =>
    motif === "autre"
      ? `Autre : ${autreMotif}`
      : getMotifLabel({
          motif: motif as MotifLabel,
          campagne: campagne as MotifCampagne,
        })
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
        <Td className={className} isNumeric={isNumeric}>
          {children}
        </Td>
      );
    return null;
  }
);

export const LineContent = ({
  demande,
  campagne,
  colonneFilters,
}: {
  demande: DemandesRestitutionIntentions["demandes"][0];
  campagne?: string;
  colonneFilters: (keyof typeof STATS_DEMANDES_COLUMNS)[];
}) => {
  return (
    <>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"motif"}
        pr="0"
        py="1"
      >
        {getTypeDemandeLabel(demande.typeDemande)}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"motif"}
        minW={400}
        maxW={400}
        whiteSpace="normal"
        textOverflow={"ellipsis"}
        isTruncated={true}
      >
        {handleMotifLabel({
          motifs: demande.motif,
          autreMotif: demande.autreMotif,
          campagne: campagne,
        })}
      </ConditionalTd>
      <ConditionalTd colonneFilters={colonneFilters} colonne={"niveauDiplome"}>
        {demande.niveauDiplome}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"libelleFormation"}
        minW={300}
        maxW={300}
        whiteSpace="normal"
      >
        {demande.libelleFormation}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"libelleEtablissement"}
        minW={300}
        maxW={300}
        whiteSpace="normal"
      >
        {demande.libelleEtablissement}
      </ConditionalTd>
      <ConditionalTd colonneFilters={colonneFilters} colonne={"commune"}>
        {demande.commune}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"libelleNsf"}
        minW={300}
        maxW={300}
        whiteSpace="normal"
      >
        {demande.libelleNsf}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"nbEtablissement"}
        isNumeric
      >
        {demande.nbEtablissement}
      </ConditionalTd>
      <ConditionalTd colonneFilters={colonneFilters} colonne={"libelleRegion"}>
        {demande.libelleRegion}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"libelleDepartement"}
      >
        {demande.libelleDepartement}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"differenceCapaciteScolaire"}
        isNumeric
      >
        {demande.differenceCapaciteScolaire ?? 0}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"differenceCapaciteApprentissage"}
        isNumeric
      >
        {demande.differenceCapaciteApprentissage ?? 0}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"tauxInsertion"}
        textAlign="center"
      >
        <GraphWrapper value={demande.tauxInsertion} />
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"tauxPoursuite"}
        textAlign="center"
      >
        <GraphWrapper value={demande.tauxPoursuite} />
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"devenirFavorable"}
        textAlign="center"
      >
        <GraphWrapper value={demande.devenirFavorable} />
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"pression"}
        textAlign="center"
      >
        <TableBadge sx={getTauxPressionStyle(demande.pression)}>
          {demande.pression ?? "-"}
        </TableBadge>
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"libelleColoration"}
        minW={300}
        maxW={300}
        whiteSpace="normal"
      >
        {demande.libelleColoration}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"libelleFCIL"}
        minW={300}
        maxW={300}
        whiteSpace="normal"
      >
        {demande.libelleFCIL}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"commentaire"}
        minW={600}
        maxW={600}
        textOverflow={"ellipsis"}
        isTruncated={true}
      >
        {demande.commentaire}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"positionQuadrant"}
      >
        {demande.positionQuadrant}
      </ConditionalTd>
      <ConditionalTd colonneFilters={colonneFilters} colonne={"numero"}>
        {demande.numero}
      </ConditionalTd>
      <ConditionalTd colonneFilters={colonneFilters} colonne={"recrutementRH"}>
        {demande.recrutementRH ? "Oui" : "Non"}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"nbRecrutementRH"}
      >
        {demande.nbRecrutementRH}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"disciplinesRecrutementRH"}
      >
        {demande.discipline1RecrutementRH &&
          `${demande.discipline1RecrutementRH} ${
            demande.discipline2RecrutementRH
              ? `- ${demande.discipline2RecrutementRH}`
              : ""
          }`}
      </ConditionalTd>
      <ConditionalTd colonneFilters={colonneFilters} colonne={"reconversionRH"}>
        {demande.reconversionRH ? "Oui" : "Non"}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"nbReconversionRH"}
      >
        {demande.nbReconversionRH}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"disciplinesReconversionRH"}
      >
        {demande.discipline1ReconversionRH &&
          `${demande.discipline1ReconversionRH} ${
            demande.discipline2ReconversionRH
              ? `- ${demande.discipline2ReconversionRH}`
              : ""
          }`}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"professeurAssocieRH"}
      >
        {demande.professeurAssocieRH ? "Oui" : "Non"}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"nbProfesseurAssocieRH"}
      >
        {demande.nbProfesseurAssocieRH}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"disciplinesProfesseurAssocieRH"}
      >
        {demande.discipline1ProfesseurAssocieRH &&
          `${demande.discipline1ProfesseurAssocieRH} ${
            demande.discipline2ProfesseurAssocieRH
              ? `- ${demande.discipline2ProfesseurAssocieRH}`
              : ""
          }`}
      </ConditionalTd>
      <ConditionalTd colonneFilters={colonneFilters} colonne={"formationRH"}>
        {demande.formationRH ? "Oui" : "Non"}
      </ConditionalTd>
      <ConditionalTd colonneFilters={colonneFilters} colonne={"nbFormationRH"}>
        {demande.nbFormationRH}
      </ConditionalTd>
      <ConditionalTd
        colonneFilters={colonneFilters}
        colonne={"disciplinesFormationRH"}
      >
        {demande.discipline1FormationRH &&
          `${demande.discipline1FormationRH} ${
            demande.discipline2FormationRH
              ? `- ${demande.discipline2FormationRH}`
              : ""
          }`}
      </ConditionalTd>
    </>
  );
};
