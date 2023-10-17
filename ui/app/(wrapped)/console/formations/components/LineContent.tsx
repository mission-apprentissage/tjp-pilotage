"use client";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, IconButton, Link, Skeleton, Td, Tr } from "@chakra-ui/react";
import NextLink from "next/link";

import { TableBadge } from "@/components/TableBadge";
import { getTauxPressionStyle } from "@/utils/getBgScale";

import { GraphWrapper } from "../../../../../components/GraphWrapper";
import { createParametrizedUrl } from "../../../../../utils/createParametrizedUrl";
import { Filters, Line } from "../types";
export const FormationLineContent = ({
  line,
  defaultRentreeScolaire,
  onClickExpend,
  onClickCollapse,
  expended = false,
  filters,
}: {
  line: Partial<Line>;
  defaultRentreeScolaire?: string;
  onClickExpend?: () => void;
  onClickCollapse?: () => void;
  expended?: boolean;
  filters?: Filters;
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
      <Td>{line.libelleNiveauDiplome ?? "-"}</Td>
      <Td minW={300} maxW={300} whiteSpace="normal">
        {line.libelleDiplome ?? "-"}
      </Td>
      <Td isNumeric>
        <Link
          variant="text"
          as={NextLink}
          href={createParametrizedUrl("/console/etablissements", {
            filters: {
              ...filters,
              cfd: [line.codeFormationDiplome],
              codeDispositif: line.dispositifId
                ? [line.dispositifId]
                : undefined,
            },
          })}
        >
          {line.nbEtablissement ?? "-"}
        </Link>
      </Td>
      <Td isNumeric>{line.effectif1 ?? "-"}</Td>
      <Td isNumeric>{line.effectif2 ?? "-"}</Td>
      <Td isNumeric>{line.effectif3 ?? "-"}</Td>
      <Td isNumeric>
        <TableBadge
          sx={getTauxPressionStyle(
            line.tauxPression !== undefined
              ? line.tauxPression / 100
              : undefined
          )}
        >
          {line.tauxPression !== undefined ? line.tauxPression / 100 : "-"}
        </TableBadge>
      </Td>
      <Td>
        <GraphWrapper value={line.tauxRemplissage} />
      </Td>
      <Td>
        <GraphWrapper
          continuum={line.continuum}
          value={line.tauxInsertion6mois}
        />
      </Td>
      <Td>
        <GraphWrapper
          continuum={line.continuum}
          value={line.tauxPoursuiteEtudes}
        />
      </Td>
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
