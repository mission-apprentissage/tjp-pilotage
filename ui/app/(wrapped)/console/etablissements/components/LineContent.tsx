"use client";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Skeleton, Tag, Td, Tr } from "@chakra-ui/react";
import { ReactNode } from "react";

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

  const format1ereCommuneLibelle = (libelleFormation?: string): ReactNode => (
    <Flex>
      {libelleFormation?.indexOf(" 1ere annee commune") != -1
        ? libelleFormation?.substring(
            0,
            libelleFormation?.indexOf(" 1ere annee commune")
          )
        : libelleFormation}
      <Tag colorScheme={"blue"} size={"sm"} ms={2}>
        1ère commune
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
      <Td minW={300} maxW={300} whiteSpace="normal">
        {line.libelleEtablissement ?? "-"}
      </Td>
      <Td minW={150} maxW={150} whiteSpace="normal">
        {line.commune ?? "-"}
      </Td>
      <Td>{line.departement ?? "-"}</Td>
      <Td>{line.libelleNiveauDiplome ?? "-"}</Td>
      <Td minW={300} maxW={300} whiteSpace="normal">
        {line.typeFamille === "2nde_commune"
          ? format2ndeCommuneLibelle(line.libelleFormation)
          : line.typeFamille === "1ere_commune"
          ? format1ereCommuneLibelle(line.libelleFormation)
          : line.libelleFormation ?? "-"}
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
      <Td>{line.uai ?? "-"} </Td>
      <Td>{line.libelleDispositif ?? "-"}</Td>
      <Td>{line.libelleFamille ?? "-"}</Td>
      <Td>{line.cfd ?? "-"}</Td>
      <Td>{line.cpc ?? "-"}</Td>
      <Td>{line.cpcSecteur ?? "-"}</Td>
      <Td>{line.cpcSousSecteur ?? "-"}</Td>
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
