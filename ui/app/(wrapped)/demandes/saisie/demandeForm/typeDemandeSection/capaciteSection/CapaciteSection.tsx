import { Box, Flex, FormErrorMessage, Highlight, Input, Table, Tbody, Td, Text, Th, Thead, Tr, VisuallyHidden } from "@chakra-ui/react";
import {Icon} from '@iconify/react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import type { RefObject} from "react";
import {useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { CURRENT_RENTREE } from "shared";
import { isTypeColoration, isTypeOuverture } from "shared/utils/typeDemandeUtils";

import {client} from '@/api.client';
import {InfoBox} from '@/app/(wrapped)/demandes/saisie/components/InfoBox';
import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";
import { SCROLL_OFFSET } from "@/app/(wrapped)/demandes/SCROLL_OFFSETS";

import { CapaciteApprentissageActuelleField } from "./CapaciteApprentissageActuelleField";
import { CapaciteApprentissageColoreeActuelleField } from "./CapaciteApprentissageColoreeActuelleField";
import { CapaciteApprentissageColoreeField } from "./CapaciteApprentissageColoreeField";
import { CapaciteApprentissageField } from "./CapaciteApprentissageField";
import { CapaciteScolaireActuelleField } from "./CapaciteScolaireActuelleField";
import { CapaciteScolaireColoreeActuelleField } from "./CapaciteScolaireColoreeActuelleField";
import { CapaciteScolaireColoreeField } from "./CapaciteScolaireColoreeField";
import { CapaciteScolaireField } from "./CapaciteScolaireField";
import { ColorationField } from "./ColorationField";
import { LibelleColorationField } from "./LibelleColorationField";

const ConstanteField = ({ id, value }: { id: string; value: string | number | undefined }) => (
  <Input
    id={id}
    opacity="1!important"
    color="blueecume.850"
    fontSize={"16px"}
    fontWeight={700}
    isDisabled
    value={Number.isNaN(value) ? undefined : value}
    textAlign={"end"}
    maxW={496}
    borderColor={"gray.200"}
    borderRadius={4}
    py={6}
  />
);

const differenceCapacité = (valueA: number | undefined, valueB: number | undefined = 0) => {
  if (valueB === undefined || valueA === undefined) return "-";
  return valueA - valueB > 0 ? `+${valueA - valueB}` : valueA - valueB;
};

export const CapaciteSection = ({
  disabled,
  capaciteRef
}: {
  disabled?: boolean;
  capaciteRef: RefObject<HTMLDivElement>;
}) => {
  const queryClient = useQueryClient();

  const [hasEffectif, setHasEffectif] = useState(false);

  const {
    watch,
    formState: { errors },
    setValue,
  } = useFormContext<DemandeFormType>();

  const coloration = watch("coloration");
  const typeDemande = watch("typeDemande");
  const ouverture = isTypeOuverture(typeDemande);

  const [capaciteScolaire, capaciteScolaireActuelle] = watch(["capaciteScolaire", "capaciteScolaireActuelle"]);
  const [capaciteApprentissage, capaciteApprentissageActuelle] = watch([
    "capaciteApprentissage",
    "capaciteApprentissageActuelle",
  ]);

  const nouvellesPlacesScolaire = (() => {
    if (isTypeColoration(typeDemande)) return "-";
    return differenceCapacité(capaciteScolaire, capaciteScolaireActuelle);
  })();

  const nouvellesPlacesApprentissage = (() => {
    if (isTypeColoration(typeDemande)) return "-";
    return differenceCapacité(capaciteApprentissage, capaciteApprentissageActuelle);
  })();

  const cfd = watch("cfd");
  const uai = watch("uai");
  const codeDispositif = watch("codeDispositif");

  const shouldFetchCapacite = !!cfd && !!uai && !!codeDispositif && !disabled;

  const { data: capacitePrecedente } = useQuery({
    keepPreviousData: false,
    staleTime: 10000000,
    queryKey: ["capacite"],
    enabled: shouldFetchCapacite,
    queryFn: async () => {
      if (!shouldFetchCapacite) return;
      return (
        await client.ref("[GET]/capacite-precedente").query({
          query: {
            cfd,
            uai,
            codeDispositif,
          },
        })
      ).capacite;
    },
    onSuccess: (capacite) => {
      if (capacite) {
        setHasEffectif(true);
        if(isTypeOuverture(typeDemande)) {
          setValue("capaciteScolaireActuelle", 0);
          return;
        }
        setValue("capaciteScolaireActuelle", capacite);
      } else {
        setHasEffectif(false);
        setValue("capaciteScolaireActuelle", 0);
      }
    },
  });

  useEffect(
    () =>
      watch((_, { name }) => {
        if (name !== "typeDemande") return;
        queryClient.invalidateQueries({ queryKey: ["capacite"] });
        if(isTypeOuverture(typeDemande)) setValue("capaciteScolaireActuelle", 0);
      }).unsubscribe
  );

  return (
    <Flex ref={capaciteRef} scrollMarginTop={SCROLL_OFFSET} gap="6" mb="4" direction={"column"}>
      <ColorationField disabled={disabled} />
      <LibelleColorationField disabled={disabled} />
      {hasEffectif && (
        ouverture ? (
          <InfoBox type="danger">
            <Flex direction={"row"} gap={3}>
              <Icon icon="ri:information-fill" fontSize="24px" />
              <Flex direction={"column"} gap={2}>
                <Text>
                  <Highlight query={`${capacitePrecedente} élèves`} styles={{ fontWeight: "700", textDecoration: "underline", color: "inherit" }}>
                    {
                      `Une capacité de ${capacitePrecedente} élèves a été trouvée pour cette offre de formation
                      pour la rentrée ${CURRENT_RENTREE}.`
                    }
                  </Highlight>
                </Text>
                <Text>
                  Assurez-vous que la formation n'est pas déjà ouverte dans cet établissement.
                </Text>
              </Flex>
            </Flex>
          </InfoBox>
        ): (
          <InfoBox>
            <Flex direction={"row"} gap={3}>
              <Icon icon="ri:information-fill" fontSize="24px" />
              <Flex direction={"column"} gap={2}>
                <Text>
                  Une capacité pour cette offre de formation a été trouvée
                  pour la rentrée {CURRENT_RENTREE} et a été pré-remplie dans le formulaire.
                </Text>
                <Text>
                  Si cette capacité ne correspond pas à la réalité, vous pouvez la modifier.
                </Text>
              </Flex>
            </Flex>
          </InfoBox>
        )
      )}
      <Table columnGap={1} rowGap={1}>
        <Thead>
          <Tr borderBottom={"2px solid black"} bgColor={"grey.975"}>
            <Th w={"30%"} fontSize={12}><VisuallyHidden>Voie</VisuallyHidden></Th>
            <Th textAlign={"end"} p={2} pe={0} fontSize={12}>
              Capacité actuelle
            </Th>
            <Th textAlign={"end"} p={2} pe={0} fontSize={12}>
              Nouvelle capacité
            </Th>
            {coloration && (
              <>
                <Th textAlign={"end"} p={2} pe={0} fontSize={12}>
                  Capacité colorée actuelle
                </Th>
                <Th textAlign={"end"} p={2} pe={0} fontSize={12}>
                  Nouvelle capacité colorée
                </Th>
              </>
            )}
            <Th textAlign={"end"} p={2} pe={0} fontSize={12}>
              Écart
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr border={"none"}>
            <Td p={2} bgColor={"grey.975"} border={"1px solid gray.200"}>
              Capacité en voie scolaire
            </Td>
            <Td p={0} border={"none"}>
              <VisuallyHidden as="label" htmlFor="capaciteScolaireActuelle">
                Capacité scolaire actuelle
              </VisuallyHidden>
              <CapaciteScolaireActuelleField id={"capaciteScolaireActuelle"} disabled={disabled} maxW={240} flex={1} />
            </Td>
            <Td p={0} border={"none"}>
              <VisuallyHidden as="label" htmlFor="capaciteScolaire">
                Capacité scolaire
              </VisuallyHidden>
              <CapaciteScolaireField id={"capaciteScolaire"} disabled={disabled} maxW={240} flex={1} />
            </Td>
            {coloration && (
              <>
                <Td p={0} border={"none"}>
                  <VisuallyHidden as="label" htmlFor="capaciteScolaireColoreeActuelle">
                    Capacité scolaire colorée actuelle
                  </VisuallyHidden>
                  <CapaciteScolaireColoreeActuelleField
                    id={"capaciteScolaireColoreeActuelle"}
                    disabled={disabled}
                    maxW={240}
                    flex={1}
                  />
                </Td>
                <Td p={0} border={"none"}>
                  <VisuallyHidden as="label" htmlFor="capaciteScolaireColoree">
                    Capacité scolaire colorée
                  </VisuallyHidden>
                  <CapaciteScolaireColoreeField
                    id={"capaciteScolaireColoree"}
                    disabled={disabled}
                    maxW={240}
                    flex={1}
                  />
                </Td>
              </>
            )}
            <Td p={0} border={"none"}>
              <VisuallyHidden as="label" htmlFor="nouvellesPlacesScolaire">
                Nouvelles places scolaires
              </VisuallyHidden>
              <ConstanteField id={"nouvellesPlacesScolaire"} value={nouvellesPlacesScolaire} />
            </Td>
          </Tr>
          <Tr border={"none"}>
            <Td p={2} bgColor={"grey.975"} border={"1px solid gray.200"}>
              Capacité en apprentissage
            </Td>
            <Td p={0} border={"none"}>
              <VisuallyHidden as="label" htmlFor="capaciteApprentissageActuelle">
                Capacité en apprentissage actuelle
              </VisuallyHidden>
              <CapaciteApprentissageActuelleField
                id={"capaciteApprentissageActuelle"}
                disabled={disabled}
                maxW={240}
                flex={1}
              />
            </Td>
            <Td p={0} border={"none"}>
              <VisuallyHidden as="label" htmlFor="capaciteApprentissage">
                Capacité en apprentissage
              </VisuallyHidden>
              <CapaciteApprentissageField id={"capaciteApprentissage"} disabled={disabled} maxW={240} flex={1} />
            </Td>
            {coloration && (
              <>
                <Td p={0} border={"none"}>
                  <VisuallyHidden as="label" htmlFor="capaciteApprentissageColoreeActuelle">
                    Capacité en apprentissage colorée actuelle
                  </VisuallyHidden>
                  <CapaciteApprentissageColoreeActuelleField
                    id={"capaciteApprentissageColoreeActuelle"}
                    disabled={disabled}
                    maxW={240}
                    flex={1} />
                </Td>
                <Td p={0} border={"none"}>
                  <VisuallyHidden as="label" htmlFor="capaciteApprentissageColoree">
                    Capacité en apprentissage colorée
                  </VisuallyHidden>
                  <CapaciteApprentissageColoreeField
                    id={"capaciteApprentissageColoree"}
                    disabled={disabled}
                    maxW={240}
                    flex={1} />
                </Td>
              </>
            )}
            <Td p={0} border={"none"}>
              <VisuallyHidden as="label" htmlFor="nouvellesPlacesApprentissage">
                Nouvelles places en apprentissage
              </VisuallyHidden>
              <ConstanteField id={"nouvellesPlacesApprentissage"} value={nouvellesPlacesApprentissage} />
            </Td>
          </Tr>
        </Tbody>
      </Table>
      <Box>
        {errors.capaciteScolaire && <FormErrorMessage>{errors.capaciteScolaire.message}</FormErrorMessage>}
        {errors.capaciteScolaireActuelle && (
          <FormErrorMessage>{errors.capaciteScolaireActuelle.message}</FormErrorMessage>
        )}
        {errors.capaciteScolaireColoree && (
          <FormErrorMessage>{errors.capaciteScolaireColoree.message}</FormErrorMessage>
        )}
        {errors.capaciteApprentissage && <FormErrorMessage>{errors.capaciteApprentissage.message}</FormErrorMessage>}
        {errors.capaciteApprentissageActuelle && (
          <FormErrorMessage>{errors.capaciteApprentissageActuelle.message}</FormErrorMessage>
        )}
        {errors.capaciteApprentissageColoree && (
          <FormErrorMessage>{errors.capaciteApprentissageColoree.message}</FormErrorMessage>
        )}
      </Box>
    </Flex>
  );
};
