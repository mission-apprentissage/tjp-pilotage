import {
  Box,
  Flex,
  FormErrorMessage,
  Heading,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import {
  isTypeColoration,
  isTypeFermeture,
} from "../../../../utils/typeDemandeUtils";
import { CorrectionForms } from "../defaultFormValues";
import { Intention } from "../types";
import { CapaciteApprentissageActuelleField } from "./CapaciteApprentissageActuelleField";
import { CapaciteApprentissageColoreeField } from "./CapaciteApprentissageColoreeField";
import { CapaciteApprentissageField } from "./CapaciteApprentissageField";
import { CapaciteConstanteSection } from "./CapaciteConstanteSection";
import { CapaciteScolaireActuelleField } from "./CapaciteScolaireActuelleField";
import { CapaciteScolaireColoreeField } from "./CapaciteScolaireColoreeField";
import { CapaciteScolaireField } from "./CapaciteScolaireField";
import { ColorationField } from "./ColorationField";
import { LibelleColorationField } from "./LibelleColorationField";

const ConstanteField = ({ value }: { value: string | number | undefined }) => (
  <Input
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

const differenceCapacité = (
  valueA: number | undefined = 0,
  valueB: number | undefined = 0
) => {
  if (valueB === undefined || valueA === undefined) return "-";
  return valueA - valueB > 0 ? `+${valueA - valueB}` : valueA - valueB;
};

export const CapaciteSection = ({ demande }: { demande: Intention }) => {
  const {
    watch,
    formState: { errors },
    setValue,
  } = useFormContext<CorrectionForms>();

  const typeDemande = demande?.typeDemande;
  const coloration =
    typeDemande !== undefined &&
    (isTypeColoration(typeDemande) ||
      (!isTypeFermeture(typeDemande) && watch("coloration")));

  const [
    capaciteScolaireActuelle,
    capaciteScolaire,
    capaciteApprentissageActuelle,
    capaciteApprentissage,
  ] = watch([
    "capaciteScolaireActuelle",
    "capaciteScolaire",
    "capaciteApprentissageActuelle",
    "capaciteApprentissage",
  ]);

  useEffect(() => {
    setValue("capaciteApprentissage", demande?.capaciteApprentissage ?? 0);
    setValue(
      "capaciteApprentissageActuelle",
      demande?.capaciteApprentissageActuelle ?? 0
    );
    setValue(
      "capaciteApprentissageColoree",
      demande?.capaciteApprentissageColoree ?? 0
    );
    setValue("capaciteScolaire", demande?.capaciteScolaire ?? 0);
    setValue(
      "capaciteScolaireActuelle",
      demande?.capaciteScolaireActuelle ?? 0
    );
    setValue("capaciteScolaireColoree", demande?.capaciteScolaireColoree ?? 0);
    nouvellesPlacesScolaire;
    nouvellesPlacesApprentissage;
  }, []);

  const nouvellesPlacesScolaire = (() => {
    if (coloration) return "-";
    return differenceCapacité(capaciteScolaire, capaciteScolaireActuelle);
  })();

  const nouvellesPlacesApprentissage = (() => {
    if (coloration) return "-";
    return differenceCapacité(
      capaciteApprentissage,
      capaciteApprentissageActuelle
    );
  })();

  return (
    <Flex gap="6" mb="6" direction={"column"}>
      <Heading as="h2" fontSize="xl" display={"flex"}>
        <Flex direction={"row"} gap={3}>
          <Icon
            icon="ri:group-line"
            color="black"
            style={{ marginTop: "auto" }}
          />
          Capacités
        </Flex>
      </Heading>
      <ColorationField demande={demande} />
      <LibelleColorationField demande={demande} />
      <Heading as={"h3"} fontSize="lg">
        Capacités prévues
      </Heading>
      <CapaciteConstanteSection demande={demande} />
      <Heading as={"h3"} fontSize="lg">
        Capacités corrigées
      </Heading>
      <Table columnGap={1} rowGap={1}>
        <Thead>
          <Tr borderBottom={"2px solid black"} bgColor={"grey.975"}>
            <Th w={"30%"}></Th>
            <Th textAlign={"end"} p={2} pe={0}>
              Capacité actuelle
            </Th>
            <Th textAlign={"end"} p={2} pe={0}>
              Nouvelle capacité
            </Th>
            {coloration && (
              <Th textAlign={"end"} p={2} pe={0}>
                Dont places colorées
              </Th>
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
              <CapaciteScolaireActuelleField flex={1} demande={demande} />
            </Td>
            <Td p={0} border={"none"}>
              <CapaciteScolaireField flex={1} demande={demande} />
            </Td>
            {coloration && (
              <Td p={0} border={"none"}>
                <CapaciteScolaireColoreeField flex={1} demande={demande} />
              </Td>
            )}
            <Td p={0} border={"none"}>
              <ConstanteField value={nouvellesPlacesScolaire} />
            </Td>
          </Tr>
          <Tr border={"none"}>
            <Td p={2} bgColor={"grey.975"} border={"1px solid gray.200"}>
              Capacité en apprentissage
            </Td>
            <Td p={0} border={"none"}>
              <CapaciteApprentissageActuelleField flex={1} demande={demande} />
            </Td>
            <Td p={0} border={"none"}>
              <CapaciteApprentissageField flex={1} demande={demande} />
            </Td>
            {coloration && (
              <Td p={0} border={"none"}>
                <CapaciteApprentissageColoreeField flex={1} demande={demande} />
              </Td>
            )}
            <Td p={0} border={"none"}>
              <ConstanteField value={nouvellesPlacesApprentissage} />
            </Td>
          </Tr>
        </Tbody>
      </Table>
      <Box mb={5}>
        {errors.capaciteScolaire && (
          <FormErrorMessage>{errors.capaciteScolaire.message}</FormErrorMessage>
        )}
        {errors.capaciteScolaireActuelle && (
          <FormErrorMessage>
            {errors.capaciteScolaireActuelle.message}
          </FormErrorMessage>
        )}
        {errors.capaciteScolaireColoree && (
          <FormErrorMessage>
            {errors.capaciteScolaireColoree.message}
          </FormErrorMessage>
        )}
        {errors.capaciteApprentissage && (
          <FormErrorMessage>
            {errors.capaciteApprentissage.message}
          </FormErrorMessage>
        )}
        {errors.capaciteApprentissageActuelle && (
          <FormErrorMessage>
            {errors.capaciteApprentissageActuelle.message}
          </FormErrorMessage>
        )}
        {errors.capaciteApprentissageColoree && (
          <FormErrorMessage>
            {errors.capaciteApprentissageColoree.message}
          </FormErrorMessage>
        )}
      </Box>
    </Flex>
  );
};
