import {
  AspectRatio,
  Box,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Link,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { useState } from "react";
import { ApiType } from "shared";

import { GraphWrapper } from "@/components/GraphWrapper";
import { InfoBlock } from "@/components/InfoBlock";

import { api } from "../../../../../api.client";
import { createParametrizedUrl } from "../../../../../utils/createParametrizedUrl";
import { Cadran } from "../../../panorama/components/Cadran";
import { Scope } from "../types";

function useFilters<F>({ defaultValues }: { defaultValues: F }) {
  const queryParams = useSearchParams();
  const router = useRouter();
  const params = qs.parse(queryParams.toString());
  const [filters, setFilters] = useState<F>({ ...defaultValues, ...params });

  return {
    setFilters: (filters: F) => {
      setFilters({ ...params, ...filters });
      router.replace(
        createParametrizedUrl(location.pathname, { ...params, ...filters }),
        { scroll: true }
      );
    },
    filters,
  };
}

export const CadranSection = ({
  scope,
}: {
  scope?: {
    type: Scope;
    value: string | undefined;
  };
}) => {
  const { filters, setFilters } = useFilters({
    defaultValues: {
      tauxPression: undefined,
      status: undefined,
      filiere: undefined,
      type: "ouverture",
    } as {
      tauxPression?: "eleve" | "faible";
      status?: "submitted" | "draft";
      filiere?: string;
      type: "ouverture" | "fermeture";
    },
  });

  const [formation, setFormation] =
    useState<ApiType<typeof api.getformationsTransformationStats>[0]>();

  const { data: formations } = useQuery({
    keepPreviousData: true,
    staleTime: 10000000,
    queryKey: ["getformationsTransformationStats", scope, filters],
    queryFn: api.getformationsTransformationStats({
      query: {
        ...filters,
        codeRegion: scope?.type === "regions" ? scope.value : undefined,
        codeAcademie: scope?.type === "academies" ? scope.value : undefined,
        codeDepartement:
          scope?.type === "departements" ? scope.value : undefined,
      },
    }).call,
    onSettled: () => setFormation(undefined),
  });

  return (
    <>
      <Heading mb="4" fontSize="2xl">
        DÉTAILS SUR LES FORMATIONS TRANSFORMÉES
      </Heading>
      <Card>
        <CardBody p="8">
          <Flex>
            <Box p="4" w="300px" bg="#F3F5FC" mr="6">
              <Heading size="sm" mb="6">
                DÉTAILS SUR LA FORMATION
              </Heading>
              {!formation && (
                <Text color="gray.500">
                  Cliquez sur un point pour afficher le détails de la formation.
                </Text>
              )}
              {formation && (
                <>
                  <InfoBlock
                    mb="4"
                    label="Formation concernée"
                    value={formation?.libelleDiplome}
                  />
                  <InfoBlock
                    mb="4"
                    label="Dispositif"
                    value={formation?.libelleDispositif}
                  />
                  <InfoBlock
                    mb="4"
                    label="Places transformées"
                    value={formation?.differencePlaces}
                  />

                  <Box mb="4">
                    <InfoBlock
                      label="Établissements concernés"
                      value={formation?.nbEtablissements}
                    />
                    <Link
                      fontSize="xs"
                      as={NextLink}
                      href={createParametrizedUrl("/console/etablissements", {
                        filters: {
                          cfd: [formation.cfd],
                          codeDispositif: [formation.dispositifId],
                        },
                      })}
                    >
                      Liste des établissements qui proposent cette formation
                    </Link>
                  </Box>

                  <InfoBlock
                    mb="4"
                    label="Taux de pression"
                    value={
                      formation.tauxPression
                        ? formation?.tauxPression / 100
                        : "-"
                    }
                  />
                  <Text mb="1" fontWeight="medium">
                    Taux d'emploi régional
                  </Text>
                  <GraphWrapper
                    mb="4"
                    w="100%"
                    continuum={formation.continuum}
                    value={formation.tauxInsertion}
                  />
                  <Text mb="1" fontWeight="medium">
                    Taux de pousuite d'études régional
                  </Text>
                  <GraphWrapper
                    w="100%"
                    continuum={formation.continuum}
                    value={formation.tauxPoursuite}
                  />
                </>
              )}
            </Box>
            <AspectRatio flex={1} ratio={1} maxW="60vh">
              <>
                {formations && (
                  <Cadran
                    onClick={setFormation}
                    meanInsertion={50}
                    meanPoursuite={50}
                    data={formations?.map((item) => ({
                      ...item,
                      tauxInsertion6mois: item.tauxInsertion,
                      tauxPoursuiteEtudes: item.tauxPoursuite,
                      effectif: item.nbDemandes,
                    }))}
                    effectifSizes={[
                      { max: 1, size: 5 },
                      { max: 5, size: 15 },
                      { max: 10, size: 25 },
                      { max: 10000, size: 40 },
                    ]}
                  />
                )}
                {!formations && <Skeleton opacity="0.3" height="100%" />}
              </>
            </AspectRatio>
            <Box p="4" ml="6" bg="#F3F5FC" w="200px">
              <Heading size="sm" mb="6">
                FILTRES
              </Heading>
              <FormControl mb="6">
                <FormLabel>Type</FormLabel>
                <RadioGroup
                  as={Stack}
                  onChange={(v) =>
                    setFilters({
                      ...filters,
                      type: v as "ouverture" | "fermeture",
                    })
                  }
                  value={filters.type}
                >
                  <Radio value="ouverture">Places ouvertes</Radio>
                  <Radio value="fermeture">Places fermées</Radio>
                </RadioGroup>
              </FormControl>
              <FormControl mb="6">
                <FormLabel>Taux de pression</FormLabel>
                <RadioGroup
                  as={Stack}
                  onChange={(v) => {
                    setFilters({
                      ...filters,
                      tauxPression: (v || undefined) as "eleve" | "faible",
                    });
                  }}
                  value={filters.tauxPression ?? ""}
                >
                  <Radio value="">Tous</Radio>
                  <Radio value="eleve">Élevé</Radio>
                  <Radio value="faible">Bas</Radio>
                </RadioGroup>
              </FormControl>
              <FormControl mb="6">
                <FormLabel>Statut de la demande</FormLabel>
                <RadioGroup
                  as={Stack}
                  onChange={(v) =>
                    setFilters({
                      ...filters,
                      status: (v || undefined) as
                        | "submitted"
                        | "draft"
                        | undefined,
                    })
                  }
                  value={filters.status ?? ""}
                >
                  <Radio value="">Toutes</Radio>
                  <Radio value="submitted">Validées</Radio>
                  <Radio value="draft">Projets</Radio>
                </RadioGroup>
              </FormControl>
            </Box>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
};
