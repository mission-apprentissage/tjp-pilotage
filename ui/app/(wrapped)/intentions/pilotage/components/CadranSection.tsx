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
import { useMemo, useState } from "react";

import { GraphWrapper } from "@/components/GraphWrapper";
import { InfoBlock } from "@/components/InfoBlock";

import { api } from "../../../../../api.client";
import { Cadran } from "../../../../../components/Cadran";
import { createParametrizedUrl } from "../../../../../utils/createParametrizedUrl";
import { useStateParams } from "../../../../../utils/useFilters";
import { Scope } from "../types";

export const CadranSection = ({
  scope,
  codeNiveauDiplome,
  filiere,
}: {
  scope?: {
    type: Scope;
    value: string | undefined;
  };
  rentreeScolaire?: string;
  codeNiveauDiplome?: string[];
  filiere?: string[];
}) => {
  const { filters, setFilters } = useStateParams({
    defaultValues: {
      tauxPression: undefined,
      status: undefined,
      type: "ouverture",
    } as {
      tauxPression?: "eleve" | "faible";
      status?: "submitted" | "draft";
      type: "ouverture" | "fermeture";
    },
  });

  const [currentCfd, setFormationId] = useState<string | undefined>();

  const { data: { formations, stats } = {} } = useQuery({
    keepPreviousData: true,
    staleTime: 10000000,
    queryKey: [
      "getFormationsTransformationStats",
      scope,
      filters,
      codeNiveauDiplome,
      filiere,
    ],
    queryFn: api.getFormationsTransformationStats({
      query: {
        ...filters,
        codeNiveauDiplome,
        filiere,
        codeRegion: scope?.type === "regions" ? scope.value : undefined,
        codeAcademie: scope?.type === "academies" ? scope.value : undefined,
        codeDepartement:
          scope?.type === "departements" ? scope.value : undefined,
      },
    }).call,
  });

  const formation = useMemo(
    () => formations?.find((item) => item.cfd === currentCfd),
    [currentCfd, formations]
  );

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
                  Cliquez sur un point pour afficher le détail de la formation.
                </Text>
              )}
              {formation && (
                <>
                  <InfoBlock
                    textBg="white"
                    mb="4"
                    label="Formation concernée"
                    value={formation?.libelleDiplome}
                  />
                  <InfoBlock
                    textBg="white"
                    mb="4"
                    label="Dispositif"
                    value={formation?.libelleDispositif}
                  />
                  {(!filters.type || filters.type === "ouverture") && (
                    <InfoBlock
                      textBg="white"
                      mb="4"
                      label={"Places ouvertes"}
                      value={formation?.placesOuvertes ?? 0}
                    />
                  )}
                  {(!filters.type || filters.type === "fermeture") && (
                    <InfoBlock
                      textBg="white"
                      mb="4"
                      label={"Places fermées"}
                      value={formation?.placesFermees ?? 0}
                    />
                  )}
                  <Box mb="4">
                    <InfoBlock
                      textBg="white"
                      label="Établissements concernés"
                      value={formation?.nbEtablissements}
                    />
                    <Link
                      fontSize="xs"
                      as={NextLink}
                      href={createParametrizedUrl("/intentions/restitution", {
                        filters: {
                          rentreeScolaire: "2024",
                          cfd: [formation.cfd],
                          codeDispositif: [formation.dispositifId],
                        },
                      })}
                    >
                      Voir la liste des demandes
                    </Link>
                  </Box>

                  <InfoBlock
                    textBg="white"
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
            <AspectRatio flex={1} ratio={1}>
              <>
                {formations && (
                  <Cadran
                    onClick={({ cfd }) => setFormationId(cfd)}
                    meanInsertion={stats?.tauxInsertion}
                    meanPoursuite={stats?.tauxPoursuite}
                    itemId={(item) => item.cfd + item.dispositifId}
                    data={formations?.map((item) => ({
                      ...item,
                      tauxInsertion6mois: item.tauxInsertion,
                      tauxPoursuiteEtudes: item.tauxPoursuite,
                      effectif: item.differencePlaces,
                    }))}
                    itemColor={(item) =>
                      item.cfd === currentCfd ? "#fd3b4cb5" : undefined
                    }
                    effectifSizes={[
                      { max: 15, size: 6 },
                      { max: 60, size: 12 },
                      { max: 150, size: 20 },
                      { max: 100000, size: 30 },
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
                      type: (v || undefined) as "ouverture" | "fermeture",
                    })
                  }
                  value={filters.type ?? ""}
                >
                  <Radio value="">Toutes</Radio>
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
