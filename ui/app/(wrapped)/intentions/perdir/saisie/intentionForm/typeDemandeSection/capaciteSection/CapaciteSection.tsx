import { Box, Flex, FormErrorMessage, Input, Table, Tbody, Td, Th, Thead, Tr, VisuallyHidden } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { isTypeColoration } from "shared/utils/typeDemandeUtils";

import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";

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

export const CapaciteSection = ({ disabled }: { disabled: boolean }) => {
  const {
    watch,
    formState: { errors },
  } = useFormContext<IntentionForms>();

  const coloration = watch("coloration");
  const typeDemande = watch("typeDemande");

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

  return (
    <Flex gap="6" mb="4" direction={"column"}>
      <ColorationField disabled={disabled} />
      <LibelleColorationField disabled={disabled} />
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
