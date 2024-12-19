import { Badge, Flex, Heading } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useState } from "react";

import { client } from "@/api.client";
import { FormationHeader } from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/components/FormationSection/FormationHeader";
import { useFormationContext } from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/context/formationContext";
import type { TauxAttractiviteType, TauxIJType } from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/types";

import { DonneesManquantes } from "./DonneesManquantes";
import { DonneesManquantesApprentissageCard } from "./DonneesManquantesApprentissageCard";
import { EffectifsEtAttractiviteGraphs } from "./EffectifsEtAttractiviteGraphs";
import { ExportListIndicateurs } from "./ExportListIndicateurs";
import { NotInScope } from "./NotInScope";
import { SoldeDePlacesTransformeesCard } from "./SoldeDePlacesTransformeesCard";
import { TauxIJCard } from "./TauxIJCard";

const useIndicateursTab = ({
  cfd,
  codeRegion,
  codeAcademie,
  codeDepartement,
}: {
  cfd: string;
  codeRegion?: string;
  codeAcademie?: string;
  codeDepartement?: string;
}) => {
  const [tauxIJSelected, setTauxIJSelected] = useState<TauxIJType>("tauxDevenirFavorable");
  const [tauxAttractiviteSelected, setTauxAttractiviteSelected] = useState<TauxAttractiviteType>("tauxPression");
  const { data: dataFormation, isLoading: isLoadingFormation } = client.ref("[GET]/formation/:cfd").useQuery(
    {
      params: { cfd },
      query: { codeRegion, codeAcademie, codeDepartement },
    },
    {
      keepPreviousData: true,
      staleTime: 10000000,
      enabled: !!cfd,
    }
  );

  const { data: dataIndicateurs, isLoading: isLoadingIndicateurs } = client
    .ref("[GET]/formation/:cfd/indicators")
    .useQuery(
      {
        params: { cfd },
        query: { codeRegion, codeAcademie, codeDepartement },
      },
      {
        keepPreviousData: true,
        staleTime: 10000000,
        enabled: !!cfd,
      }
    );

  const handleChangeTauxIJ = (e: ChangeEvent<HTMLSelectElement>) => {
    setTauxIJSelected(e.target.value as TauxIJType);
  };

  const handleChangeTauxAttractivite = (e: ChangeEvent<HTMLSelectElement>) => {
    setTauxAttractiviteSelected(e.target.value as TauxAttractiviteType);
  };

  return {
    isLoadingFormation,
    isLoadingIndicateurs,
    tauxIJSelected,
    handleChangeTauxIJ,
    tauxAttractiviteSelected,
    handleChangeTauxAttractivite,
    dataFormation,
    dataIndicateurs,
  };
};

export const IndicateursTab = () => {
  const { currentFilters, scope, codeNsf } = useFormationContext();
  const { codeRegion, codeAcademie, codeDepartement, cfd } = currentFilters;

  const {
    tauxIJSelected,
    handleChangeTauxIJ,
    tauxAttractiviteSelected,
    handleChangeTauxAttractivite,
    isLoadingIndicateurs,
    isLoadingFormation,
    dataFormation,
    dataIndicateurs,
  } = useIndicateursTab({
    cfd,
    codeRegion,
    codeAcademie,
    codeDepartement,
  });

  if (!cfd || isLoadingFormation || isLoadingIndicateurs || !dataFormation || !dataIndicateurs) {
    return null;
  }

  return (
    <Flex direction={"column"} gap={8}>
      <FormationHeader
        data={dataFormation}
        exportButton={<ExportListIndicateurs formation={dataFormation} indicateurs={dataIndicateurs} />}
      />
      {dataFormation.isInScope ? (
        <>
          <Flex direction={"column"} gap={4} w={"100%"}>
            <Heading as="h3" fontSize={"14px"} fontWeight={"bold"}>
              DEVENIR DES ÉLÈVES
            </Heading>
            <TauxIJCard
              scope={scope}
              handleChangeTauxIJ={handleChangeTauxIJ}
              tauxIJSelected={tauxIJSelected}
              formation={dataFormation}
              indicateurs={dataIndicateurs}
            />
          </Flex>

          {dataFormation.isScolaire && (
            <Flex direction={"column"} gap={4}>
              <Flex direction={"row"} gap={"16px"} alignItems={"center"}>
                <Heading as="h3" fontSize={"14px"} fontWeight={"bold"}>
                  EFFECTIFS ET ATTRACTIVITÉ
                </Heading>
                <Badge>VOIE SCOLAIRE</Badge>
              </Flex>
              <EffectifsEtAttractiviteGraphs
                formation={dataFormation}
                indicateurs={dataIndicateurs}
                scope={scope}
                tauxAttractiviteSelected={tauxAttractiviteSelected}
                handleChangeTauxAttractivite={handleChangeTauxAttractivite}
              />
            </Flex>
          )}

          <Flex direction={"column"} gap={4}>
            <Flex direction={"row"} gap={"16px"} alignItems={"center"}>
              <Heading as="h3" fontSize={"14px"} fontWeight={"bold"}>
                TRANSFORMATION DE LA CARTE
              </Heading>
            </Flex>
            <SoldeDePlacesTransformeesCard scope={scope} data={dataIndicateurs} />
          </Flex>

          <DonneesManquantesApprentissageCard
            cfd={cfd}
            codeNsf={codeNsf}
            codeRegion={codeRegion}
            formation={dataFormation}
          />

          <DonneesManquantes
            formation={dataFormation}
            indicateurs={dataIndicateurs}
            tauxAttractiviteSelected={tauxAttractiviteSelected}
            tauxIJSelected={tauxIJSelected}
            codeNsf={codeNsf}
            cfd={cfd}
            codeRegion={codeRegion}
          />
        </>
      ) : (
        <NotInScope cfd={cfd} />
      )}
    </Flex>
  );
};
