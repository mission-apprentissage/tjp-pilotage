import { Td } from "@chakra-ui/react";

import { GraphWrapper } from "../../../../../components/GraphWrapper";
import { TableBadge } from "../../../../../components/TableBadge";
import { getTauxPressionStyle } from "../../../../../utils/getBgScale";
import { getMotifLabel, MotifLabel } from "../../../utils/motifDemandeUtils";
import { getTypeDemandeLabel } from "../../../utils/typeDemandeUtils";
import { StatsIntentions } from "../types";
export const LineContent = ({
  demande,
}: {
  demande: StatsIntentions["demandes"][0];
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
      <Td pr="0" py="1">
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
        {demande.libelleDiplome}
      </Td>
      <Td minW={300} maxW={300} whiteSpace="normal">
        {demande.libelleEtablissement}
      </Td>
      <Td>{demande.commune}</Td>
      <Td minW={300} maxW={300} whiteSpace="normal">
        {demande.libelleFiliere}
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
        <TableBadge
          sx={getTauxPressionStyle(
            demande.pression !== undefined ? demande.pression : undefined
          )}
        >
          {demande.pression !== undefined ? demande.pression : "-"}
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
      <Td>{demande.id}</Td>
    </>
  );
};
