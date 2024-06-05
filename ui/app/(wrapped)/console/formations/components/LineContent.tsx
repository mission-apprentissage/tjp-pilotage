"use client";
import { ArrowForwardIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Link,
  Skeleton,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import NextLink from "next/link";

import { formatAnneeCommuneLibelle } from "@/app/(wrapped)/utils/formatLibelle";
import { GraphWrapper } from "@/components/GraphWrapper";
import { TableBadge } from "@/components/TableBadge";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";
import { getTauxPressionStyle } from "@/utils/getBgScale";

import { Line } from "../types";

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
}) => (
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
    <Td minW={450} whiteSpace={"normal"}>
      <Flex>
        {formatAnneeCommuneLibelle(line, "long", "sm")}
        {line.formationRenovee && (
          <Flex
            ms={2}
            mt={"auto"}
            width={"fit-content"}
            h={"1.5rem"}
            whiteSpace={"nowrap"}
          >
            <Link
              variant="text"
              as={NextLink}
              href={createParametrizedUrl("/console/formations", {
                filters: {
                  cfd: [line.formationRenovee],
                },
              })}
              color="bluefrance.113"
            >
              <Flex my="auto">
                <Text fontSize={"11px"}>Voir la formation rénovée</Text>
                <ArrowForwardIcon
                  ml={1}
                  boxSize={"14px"}
                  verticalAlign={"baseline"}
                />
              </Flex>
            </Link>
          </Flex>
        )}
      </Flex>
    </Td>
    <Td isNumeric>
      <Link
        variant="text"
        as={NextLink}
        href={createParametrizedUrl("/console/etablissements", {
          filters: {
            cfd: [line.cfd],
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
    <Td>{line.libelleNsf ?? "-"}</Td>
    <Td>{line.positionQuadrant}</Td>
  </>
);

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
