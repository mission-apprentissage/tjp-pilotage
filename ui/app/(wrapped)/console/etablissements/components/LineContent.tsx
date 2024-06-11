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

import { GraphWrapper } from "@/components/GraphWrapper";
import { TableBadge } from "@/components/TableBadge";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";
import { getTauxPressionStyle } from "@/utils/getBgScale";

import { formatAnneeCommuneLibelle } from "../../../utils/formatLibelle";
import { Line } from "../types";

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
    <Td minW={300} maxW={300} whiteSpace="normal">
      <Link
        variant="text"
        as={NextLink}
        href={`/panorama/etablissement/${line.uai}`}
        target="_blank"
        color="chakra-body-text"
        fontWeight={400}
        _hover={{
          textDecoration: "underline",
        }}
      >
        <Flex justify={"start"}>{line.libelleEtablissement ?? "-"}</Flex>
      </Link>
    </Td>
    <Td minW={150} maxW={150} whiteSpace="normal">
      {line.commune ?? "-"}
    </Td>
    <Td>{line.libelleDepartement ?? "-"}</Td>
    <Td>{line.libelleNiveauDiplome ?? "-"}</Td>
    <Td minW={450} whiteSpace="normal">
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
              href={createParametrizedUrl("/console/etablissements", {
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

    <Td isNumeric>{line.effectif1 ?? "-"}</Td>
    <Td isNumeric>{line.effectif2 ?? "-"}</Td>
    <Td isNumeric>{line.effectif3 ?? "-"}</Td>
    <Td isNumeric>{line.capacite ?? "-"}</Td>
    <Td textAlign={"center"}>
      <TableBadge
        sx={getTauxPressionStyle(
          line.tauxPression !== undefined
            ? Math.round(line.tauxPression * 100) / 100
            : undefined
        )}
      >
        {line.tauxPression !== undefined
          ? Math.round(line.tauxPression * 100) / 100
          : "-"}
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
    <Td>{line.uai ?? "-"} </Td>
    <Td>{line.libelleDispositif ?? "-"}</Td>
    <Td>{line.libelleFamille ?? "-"}</Td>
    <Td>{line.cfd ?? "-"}</Td>
    <Td>{line.cpc ?? "-"}</Td>
    <Td>{line.cpcSecteur ?? "-"}</Td>
    <Td>{line.cpcSousSecteur ?? "-"}</Td>
    <Td>{line.libelleNsf ?? "-"}</Td>
  </>
);

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
