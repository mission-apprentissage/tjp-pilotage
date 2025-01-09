import {Box, Flex, FormErrorMessage, Heading, Input,Table, Tbody, Td, Th, Thead, Tr, VisuallyHidden} from '@chakra-ui/react';
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import type { CorrectionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/correctionSection/defaultFormValues";
import type { Intention } from "@/app/(wrapped)/intentions/saisie/intentionForm/correctionSection/types";
import { isTypeColoration } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";

import { CapaciteApprentissageActuelleField } from "./CapaciteApprentissageActuelleField";
import { CapaciteApprentissageColoreeActuelleField } from "./CapaciteApprentissageColoreeActuelleField";
import { CapaciteApprentissageColoreeField } from "./CapaciteApprentissageColoreeField";
import { CapaciteApprentissageField } from "./CapaciteApprentissageField";
import { CapaciteScolaireActuelleField } from "./CapaciteScolaireActuelleField";
import { CapaciteScolaireColoreeActuelleField } from "./CapaciteScolaireColoreeActuelleField";
import { CapaciteScolaireColoreeField } from "./CapaciteScolaireColoreeField";
import { CapaciteScolaireField } from "./CapaciteScolaireField";


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

const differenceCapacité = (valueA: number | undefined = 0, valueB: number | undefined = 0) => {
  if (valueB === undefined || valueA === undefined) return "-";
  return valueA - valueB > 0 ? `+${valueA - valueB}` : valueA - valueB;
};

export const CapaciteSection = ({ demande, disabled }: { demande: Intention; disabled?: boolean }) => {
  const {
    watch,
    formState: { errors },
    setValue,
  } = useFormContext<CorrectionForms>();

  const typeDemande = demande?.typeDemande;
  const coloration = (typeDemande !== undefined && isTypeColoration(typeDemande)) || demande?.coloration;

  const [capaciteScolaireActuelle, capaciteScolaire, capaciteApprentissageActuelle, capaciteApprentissage] = watch([
    "capaciteScolaireActuelle",
    "capaciteScolaire",
    "capaciteApprentissageActuelle",
    "capaciteApprentissage",
  ]);

  useEffect(() => {
    setValue(
      "capaciteApprentissage",
      demande?.correction?.capaciteApprentissage ?? demande?.capaciteApprentissage ?? 0
    );
    setValue(
      "capaciteApprentissageActuelle",
      demande?.correction?.capaciteApprentissageActuelle ?? demande?.capaciteApprentissageActuelle ?? 0
    );
    setValue(
      "capaciteApprentissageColoree",
      demande?.correction?.capaciteApprentissageColoree ?? demande?.capaciteApprentissageColoree ?? 0
    );
    setValue("capaciteScolaire", demande?.correction?.capaciteScolaire ?? demande?.capaciteScolaire ?? 0);
    setValue(
      "capaciteScolaireActuelle",
      demande?.correction?.capaciteScolaireActuelle ?? demande?.capaciteScolaireActuelle ?? 0
    );
    setValue(
      "capaciteScolaireColoree",
      demande?.correction?.capaciteScolaireColoree ?? demande?.capaciteScolaireColoree ?? 0
    );
  }, []);

  const nouvellesPlacesScolaire = (() => {
    if (coloration) return "-";
    return differenceCapacité(capaciteScolaire, capaciteScolaireActuelle);
  })();

  const nouvellesPlacesApprentissage = (() => {
    if (coloration) return "-";
    return differenceCapacité(capaciteApprentissage, capaciteApprentissageActuelle);
  })();

  return (
    <Flex gap="4" direction={"column"}>
      <Heading as={"h3"} fontSize="lg" mt={3}>
        Rectification des effectifs
      </Heading>
      <Table columnGap={1} rowGap={1}>
        <Thead>
          <Tr borderBottom={"2px solid black"} bgColor={"grey.975"}>
            <Th w={"30%"}><VisuallyHidden>Voie</VisuallyHidden></Th>
            <Th textAlign={"end"} p={2} pe={0}>
              Capacité actuelle
            </Th>
            <Th textAlign={"end"} p={2} pe={0}>
              Nouvelle capacité
            </Th>
            {coloration && (
              <>
                <Th textAlign={"end"} p={2} pe={0}>
                  Capacité colorée actuelle
                </Th>
                <Th textAlign={"end"} p={2} pe={0}>
                  Nouvelle capacité colorée
                </Th>
              </>
            )}
            <Th textAlign={"end"} p={2} pe={0}>
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
              <VisuallyHidden as="label" htmlFor="correctionCapaciteScolaireActuelle">Capacité scolaire actuelle</VisuallyHidden>
              <CapaciteScolaireActuelleField
                id={"correctionCapaciteScolaireActuelle"}
                flex={1}
                maxW={240}
                demande={demande}
                disabled={disabled}
              />
            </Td>
            <Td p={0} border={"none"}>
              <VisuallyHidden as="label" htmlFor="correctionCapaciteScolaire">Capacité scolaire</VisuallyHidden>
              <CapaciteScolaireField
                id={"correctionCapaciteScolaire"}
                flex={1}
                maxW={240}
                demande={demande}
                disabled={disabled}
              />
            </Td>
            {coloration && (
              <>
                <Td p={0} border={"none"}>
                  <VisuallyHidden as="label" htmlFor="correctionCapaciteScolaireColoreeActuelle">Capacité scolaire colorée actuelle</VisuallyHidden>
                  <CapaciteScolaireColoreeActuelleField
                    id={"correctionCapaciteScolaireColoreeActuelle"}
                    flex={1}
                    maxW={240}
                    demande={demande}
                    disabled={disabled}
                  />
                </Td>
                <Td p={0} border={"none"}>
                  <VisuallyHidden as="label" htmlFor="correctionCapaciteScolaireColoree">Capacité scolaire colorée</VisuallyHidden>
                  <CapaciteScolaireColoreeField
                    id={"correctionCapaciteScolaireColoree"}
                    flex={1}
                    maxW={240}
                    demande={demande}
                    disabled={disabled}
                  />
                </Td>
              </>
            )}
            <Td p={0} border={"none"}>
              <VisuallyHidden as="label" htmlFor="correctionNouvellesPlacesScolaire">
                Nouvelles places scolaire
              </VisuallyHidden>
              <ConstanteField id={"correctionNouvellesPlacesScolaire"} value={nouvellesPlacesScolaire} />
            </Td>
          </Tr>
          <Tr border={"none"}>
            <Td p={2} bgColor={"grey.975"} border={"1px solid gray.200"}>
              Capacité en apprentissage
            </Td>
            <Td p={0} border={"none"}>
              <VisuallyHidden as="label" htmlFor="correctionCapaciteApprentissageActuelle">Capacité en apprentissage actuelle</VisuallyHidden>
              <CapaciteApprentissageActuelleField
                id={"correctionCapaciteApprentissageActuelle"}
                flex={1}
                maxW={240}
                demande={demande}
                disabled={disabled}
              />
            </Td>
            <Td p={0} border={"none"}>
              <VisuallyHidden as="label" htmlFor="correctionCapaciteApprentissage">Capacité en apprentissage</VisuallyHidden>
              <CapaciteApprentissageField
                id={"correctionCapaciteApprentissage"}
                flex={1}
                maxW={240}
                demande={demande}
                disabled={disabled}
              />
            </Td>
            {coloration && (
              <>
                <Td p={0} border={"none"}>
                  <VisuallyHidden as="label" htmlFor="correctionCapaciteApprentissageColoreeActuelle">
                    Capacité scolaire colorée actuelle
                  </VisuallyHidden>
                  <CapaciteApprentissageColoreeActuelleField
                    id={"correctionCapaciteApprentissageColoreeActuelle"}
                    flex={1}
                    maxW={240}
                    demande={demande}
                    disabled={disabled}
                  />
                </Td>
                <Td p={0} border={"none"}>
                  <VisuallyHidden as="label" htmlFor="correctionCapaciteScolaireColoree">Capacité en apprentissage colorée</VisuallyHidden>
                  <CapaciteApprentissageColoreeField
                    id={"correctionCapaciteScolaireColoree"}
                    flex={1}
                    maxW={240}
                    demande={demande}
                    disabled={disabled}
                  />
                </Td>
              </>
            )}
            <Td p={0} border={"none"}>
              <VisuallyHidden as="label" htmlFor="correctionNouvellesPlacesApprentissage">
                Nouvelles places en apprentissage
              </VisuallyHidden>
              <ConstanteField id={"correctionNouvellesPlacesApprentissage"} value={nouvellesPlacesApprentissage} />
            </Td>
          </Tr>
        </Tbody>
      </Table>
      <Box mb={5}>
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
