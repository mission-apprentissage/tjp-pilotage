"use client";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, IconButton, Skeleton, Td, Tr } from "@chakra-ui/react";

import { TableBadge } from "@/components/TableBadge";

import { GraphWrapper } from "../../../../../components/GraphWrapper";
import { getTauxPressionStyle } from "../../../../../utils/getBgScale";
import { Line } from "../page";

export const EtablissementLineContent = ({
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
      <Td pr="0" py="1">
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
      <Td minW={300} maxW={300} whiteSpace="normal">
        {line.libelleEtablissement ?? "-"}
      </Td>
      <Td minW={150} maxW={150} whiteSpace="normal">
        {line.commune ?? "-"}
      </Td>
      <Td>{line.departement ?? "-"}</Td>
      <Td>{line.libelleNiveauDiplome ?? "-"}</Td>
      <Td minW={300} maxW={300} whiteSpace="normal">
        {line.libelleDiplome ?? "-"}
      </Td>

      <Td isNumeric>{line.effectif1 ?? "-"}</Td>
      <Td isNumeric>{line.effectif2 ?? "-"}</Td>
      <Td isNumeric>{line.effectif3 ?? "-"}</Td>
      <Td isNumeric>{line.capacite ?? "-"}</Td>
      <Td textAlign={"center"}>
        <TableBadge
          sx={getTauxPressionStyle(
            line.tauxPression !== undefined ? line.tauxPression : undefined
          )}
        >
          {line.tauxPression !== undefined ? line.tauxPression : "-"}
        </TableBadge>
      </Td>
      <Td textAlign={"center"}>
        <GraphWrapper value={line.tauxRemplissage} />
      </Td>
      <Td textAlign={"center"}>
        <GraphWrapper continuum={line.continuum} value={line.tauxInsertion} />
      </Td>
      <Td textAlign={"center"}>
        <GraphWrapper continuum={line.continuum} value={line.tauxPoursuite} />
      </Td>
      <Td>{line.positionQuadrant}</Td>
      <Td textAlign="center">
        <GraphWrapper
          continuum={line.continuum}
          value={line.tauxDevenirFavorable}
        />
      </Td>
      <Td>
        <GraphWrapper
          continuum={line.continuumEtablissement}
          value={line.tauxInsertionEtablissement}
        />
      </Td>
      <Td>
        <GraphWrapper
          continuum={line.continuumEtablissement}
          value={line.tauxPoursuiteEtablissement}
        />
      </Td>
      <Td textAlign="center">
        <GraphWrapper
          continuum={line.continuumEtablissement}
          value={line.tauxDevenirFavorableEtablissement}
        />
      </Td>
      <Td>{line.valeurAjoutee ?? "-"} </Td>
      <Td>{line.secteur ?? "-"} </Td>
      <Td>{line.UAI ?? "-"} </Td>
      <Td>{line.libelleDispositif ?? "-"}</Td>
      <Td>{line.libelleOfficielFamille ?? "-"}</Td>
      <Td>{line.codeFormationDiplome ?? "-"}</Td>
      <Td>{line.CPC ?? "-"}</Td>
      <Td>{line.CPCSecteur ?? "-"}</Td>
      <Td>{line.CPCSousSecteur ?? "-"}</Td>
      <Td>{line.libelleFiliere ?? "-"}</Td>
    </>
  );
};

export const EtablissementLineLoader = () => (
  <Tr bg={"grey.975"}>
    {new Array(17).fill(0).map((_, i) => (
      <Td key={i}>
        <Skeleton opacity={0.3} height="16px" />
      </Td>
    ))}
  </Tr>
);

export const EtablissementLinePlaceholder = () => (
  <Tr bg={"grey.975"}>
    <EtablissementLineContent line={{}} />
  </Tr>
);
