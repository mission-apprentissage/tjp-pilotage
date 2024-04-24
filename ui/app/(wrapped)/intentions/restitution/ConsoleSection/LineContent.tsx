import { Td } from "@chakra-ui/react";

import { GraphWrapper } from "@/components/GraphWrapper";
import { TableBadge } from "@/components/TableBadge";
import { getTauxPressionStyle } from "@/utils/getBgScale";

import { getMotifLabel, MotifLabel } from "../../utils/motifDemandeUtils";
import { getTypeDemandeLabel } from "../../utils/typeDemandeUtils";
import { DemandesRestitutionIntentions } from "../types";

export const LineContent = ({
  demande,
}: {
  demande: DemandesRestitutionIntentions["demandes"][0];
}) => {
  const handleMotifLabel = (motif?: string[], autreMotif?: string) => {
    return motif ? (
      `(${motif.length}) ${motif.map(
        (motifLabel: string, index: number) =>
          `${
            motifLabel === "autre"
              ? `Autre : ${autreMotif}\n`
              : getMotifLabel(motifLabel as MotifLabel)
          }${motif && motif.length - 1 > index ? ", " : ""}`
      )}`
    ) : (
      <></>
    );
  };

  return (
    <>
      <Td pr="0" py="1" position="sticky" left={0}>
        {getTypeDemandeLabel(demande.typeDemande)}
      </Td>
      <Td
        minW={400}
        maxW={400}
        whiteSpace="normal"
        textOverflow={"ellipsis"}
        isTruncated={true}
      >
        {handleMotifLabel(demande.motif, demande.autreMotif)}
      </Td>
      <Td>{demande.niveauDiplome}</Td>
      <Td minW={300} maxW={300} whiteSpace="normal">
        {demande.libelleFormation}
      </Td>
      <Td minW={300} maxW={300} whiteSpace="normal">
        {demande.libelleEtablissement}
      </Td>
      <Td>{demande.commune}</Td>
      <Td minW={300} maxW={300} whiteSpace="normal">
        {demande.libelleNsf}
      </Td>
      <Td isNumeric>{demande.nbEtablissement}</Td>
      <Td>{demande.libelleRegion}</Td>
      <Td>{demande.libelleDepartement}</Td>
      <Td isNumeric>{demande.differenceCapaciteScolaire ?? 0}</Td>
      <Td isNumeric>{demande.differenceCapaciteApprentissage ?? 0}</Td>
      <Td textAlign="center">
        <GraphWrapper value={demande.tauxInsertion} />
      </Td>
      <Td textAlign="center">
        <GraphWrapper value={demande.tauxPoursuite} />
      </Td>
      <Td textAlign="center">
        <GraphWrapper value={demande.devenirFavorable} />
      </Td>
      <Td textAlign="center">
        <TableBadge sx={getTauxPressionStyle(demande.pression)}>
          {demande.pression ?? "-"}
        </TableBadge>
      </Td>
      <Td minW={300} maxW={300} whiteSpace="normal">
        {demande.libelleColoration}
      </Td>
      <Td minW={300} maxW={300} whiteSpace="normal">
        {demande.libelleFCIL}
      </Td>
      <Td minW={600} maxW={600} textOverflow={"ellipsis"} isTruncated={true}>
        {demande.commentaire}
      </Td>
      <Td>{demande.positionQuadrant}</Td>
      <Td>{demande.numero}</Td>
      <Td>{demande.recrutementRH ? "Oui" : "Non"}</Td>
      <Td>{demande.nbRecrutementRH}</Td>
      <Td>
        {demande.discipline1RecrutementRH &&
          `${demande.discipline1RecrutementRH} ${
            demande.discipline2RecrutementRH
              ? `- ${demande.discipline2RecrutementRH}`
              : ""
          }`}
      </Td>
      <Td>{demande.reconversionRH ? "Oui" : "Non"}</Td>
      <Td>{demande.nbReconversionRH}</Td>
      <Td>
        {demande.discipline1ReconversionRH &&
          `${demande.discipline1ReconversionRH} ${
            demande.discipline2ReconversionRH
              ? `- ${demande.discipline2ReconversionRH}`
              : ""
          }`}
      </Td>
      <Td>{demande.professeurAssocieRH ? "Oui" : "Non"}</Td>
      <Td>{demande.nbProfesseurAssocieRH}</Td>
      <Td>
        {demande.discipline1ProfesseurAssocieRH &&
          `${demande.discipline1ProfesseurAssocieRH} ${
            demande.discipline2ProfesseurAssocieRH
              ? `- ${demande.discipline2ProfesseurAssocieRH}`
              : ""
          }`}
      </Td>
      <Td>{demande.formationRH ? "Oui" : "Non"}</Td>
      <Td>{demande.nbFormationRH}</Td>
      <Td>
        {demande.discipline1FormationRH &&
          `${demande.discipline1FormationRH} ${
            demande.discipline2FormationRH
              ? `- ${demande.discipline2FormationRH}`
              : ""
          }`}
      </Td>
    </>
  );
};
