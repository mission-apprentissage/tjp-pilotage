"use client";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Link,
  Skeleton,
  Tag,
  Td,
  Tr,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ReactNode } from "react";

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
  const format2ndeCommuneLibelle = (libelleFormation?: string): ReactNode => (
    <Flex>
      {libelleFormation?.indexOf(" 2nde commune") != -1
        ? libelleFormation?.substring(
            0,
            libelleFormation?.indexOf(" 2nde commune")
          )
        : libelleFormation}
      <Tag colorScheme={"blue"} size={"sm"} ms={2}>
        2nde commune
      </Tag>
    </Flex>
  );

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
      <Td
        minW={300}
        whiteSpace={line.typeFamille === "2nde_commune" ? undefined : "normal"}
      >
        <>
          {line.typeFamille === "2nde_commune"
            ? format2ndeCommuneLibelle(line.libelleFormation)
            : line.libelleFormation ?? "-"}
        </>
      </Td>
      <Td isNumeric>
        <Link
          variant="text"
          as={NextLink}
          href={createParametrizedUrl("/console/etablissements", {
            filters: {
              ...filters,
              codeDispositif: line.codeDispositif
                ? [line.codeDispositif]
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
      <Td textAlign="center">
        <GraphWrapper
          continuum={line.continuum}
          value={line.tauxDevenirFavorable}
        />
      </Td>
      <Td>{line.libelleDispositif ?? "-"}</Td>
      <Td>{line.libelleFamille ?? "-"}</Td>
      <Td>{line.cfd ?? "-"}</Td>
      <Td>{line.cpc ?? "-"}</Td>
      <Td>{line.cpcSecteur ?? "-"}</Td>
      <Td>{line.cpcSousSecteur ?? "-"}</Td>
      <Td>{line.libelleFiliere ?? "-"}</Td>
      <Td>{line.positionQuadrant}</Td>
    </>
  );
};

export const FormationLineLoader = () => (
  <Tr bg={"grey.975"}>
    {new Array(17).fill(0).map((_, i) => (
      <Td key={i}>
        <Skeleton opacity={0.3} height="16px" />
      </Td>
    ))}
  </Tr>
);

export const FormationLinePlaceholder = () => (
  <Tr bg={"grey.975"}>
    <FormationLineContent line={{}} />
  </Tr>
);
