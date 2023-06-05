"use client";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, IconButton, Skeleton, Td, Tr } from "@chakra-ui/react";

import { getTauxPressionStyle } from "@/utils/getBgScale";

import { GraphWrapper } from "../../../../components/GraphWrapper";
import { Line } from "../page";

export const FormationLineContent = ({
  line,
  defaultRentreeScolaire,
  onClickExpend,
  onClickCollapse,
  expended = false,
}: {
  line: Partial<Line>;
  defaultRentreeScolaire?: string;
  onClickExpend?: () => void;
  onClickCollapse?: () => void;
  expended?: boolean;
}) => {
  return (
    <>
      <Td py="1">
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
      <Td>{line.rentreeScolaire ?? defaultRentreeScolaire ?? "-"}</Td>
      <Td>{line.libelleNiveauDiplome ?? "-"}</Td>
      <Td>{line.libelleDiplome ?? "-"}</Td>
      <Td isNumeric>{line.nbEtablissement ?? "-"}</Td>
      <Td isNumeric>{line.effectif1 ?? "-"}</Td>
      <Td isNumeric>{line.effectif2 ?? "-"}</Td>
      <Td isNumeric>{line.effectif3 ?? "-"}</Td>
      <Td
        style={getTauxPressionStyle(
          line.tauxPression !== undefined ? line.tauxPression / 100 : undefined
        )}
        isNumeric
      >
        {line.tauxPression !== undefined ? line.tauxPression / 100 : "-"}
      </Td>
      <Td isNumeric>
        <GraphWrapper value={line.tauxRemplissage} />
      </Td>
      <Td isNumeric>
        <GraphWrapper value={line.tauxInsertion12mois} />
      </Td>
      <Td isNumeric>
        <GraphWrapper centered value={line.deltaInsertion12mois} />
      </Td>
      <Td isNumeric>
        <GraphWrapper value={line.tauxPoursuiteEtudes} />
      </Td>
      <Td isNumeric>
        <GraphWrapper centered value={line.deltaPoursuiteEtudes} />
      </Td>
      <Td>{line.libelleDispositif ?? "-"}</Td>
      <Td>{line.libelleOfficielFamille ?? "-"}</Td>
      <Td>{line.codeFormationDiplome ?? "-"}</Td>
      <Td>-</Td>
    </>
  );
};

export const FormationLineLoader = () => (
  <Tr bg={"#f5f5f5"}>
    {new Array(17).fill(0).map((_, i) => (
      <Td key={i}>
        <Skeleton opacity={0.3} height="16px" />
      </Td>
    ))}
  </Tr>
);

export const FormationLinePlaceholder = () => (
  <Tr bg={"#f5f5f5"}>
    <FormationLineContent line={{}} />
  </Tr>
);
