"use client";
import { Box } from "@chakra-ui/react";
import { ApiType } from "shared";

import { ContinuumIcon } from "@/components/icons/ContinuumIcon";

import { api } from "../../../../../api.client";
import { ContinuumIconOutline } from "../../../../../components/icons/ContinuumIcon";
import { InfoBlock } from "../../../../../components/InfoBlock";

export const FormationTooltipContent = ({
  formation,
}: {
  formation: ApiType<typeof api.getEtablissement>["formations"][number];
}) => (
  <Box bg="white" fontSize="xs">
    <InfoBlock
      mb="2"
      label="Formation concernée:"
      value={formation.libelleDiplome}
    />
    <InfoBlock
      mb="2"
      label="Dispositif concerné:"
      value={formation.libelleDispositif}
    />
    <InfoBlock
      mb="2"
      label="Effectif de l'établissement:"
      value={formation.effectif ?? "-"}
    />
    <InfoBlock
      mb="2"
      label="Taux de pression de l'établissement:"
      value={formation.tauxPression ? formation?.tauxPression / 100 : "-"}
    />
    <InfoBlock
      mb="2"
      label={
        <>
          Taux d'emploi régional:
          {formation.continuum && (
            <ContinuumIcon fontSize="16" mb="0.5" m={"1"} color="#7B61FF" />
          )}
        </>
      }
      value={`${formation?.tauxInsertion6mois}%`}
    />
    <InfoBlock
      label={
        <>
          Taux de pousuite d'études régional:
          {formation.continuum && (
            <ContinuumIcon fontSize="16" mb="0.5" m={"1"} color="#7B61FF" />
          )}
        </>
      }
      value={`${formation?.tauxPoursuiteEtudes}%`}
    />
    {formation.continuum && (
      <Box bg="#7B61FF" mt="4" color="white" p="2">
        <ContinuumIconOutline fontSize="16" mr="1" />
        Données manquantes sur cette formation, le taux affiché est celui de la
        formation historique <i>"{formation.continuum.libelle}"</i>.
      </Box>
    )}
  </Box>
);
