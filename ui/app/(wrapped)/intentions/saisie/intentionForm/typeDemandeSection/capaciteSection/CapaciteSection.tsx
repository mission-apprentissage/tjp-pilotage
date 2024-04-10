import { Flex, Input, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "../../defaultFormValues";
import { CapaciteApprentissageActuelleField } from "./CapaciteApprentissageActuelleField";
import { CapaciteApprentissageColoreeField } from "./CapaciteApprentissageColoreeField";
import { CapaciteApprentissageField } from "./CapaciteApprentissageField";
import { CapaciteScolaireActuelleField } from "./CapaciteScolaireActuelleField";
import { CapaciteScolaireColoreeField } from "./CapaciteScolaireColoreeField";
import { CapaciteScolaireField } from "./CapaciteScolaireField";
import { ColorationField } from "./ColorationField";
import { LibelleColorationField } from "./LibelleColorationField";
import { MixteField } from "./MixteField";

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
  valueA: number | undefined,
  valueB: number | undefined = 0
) => {
  if (valueB === undefined || valueA === undefined) return "-";
  return valueA - valueB > 0 ? `+${valueA - valueB}` : valueA - valueB;
};

export const CapaciteSection = ({ disabled }: { disabled: boolean }) => {
  const { watch } = useFormContext<IntentionForms>();

  const coloration = watch("coloration");

  const [capaciteScolaire, capaciteScolaireActuelle] = watch([
    "capaciteScolaire",
    "capaciteScolaireActuelle",
  ]);
  const [capaciteApprentissage, capaciteApprentissageActuelle] = watch([
    "capaciteApprentissage",
    "capaciteApprentissageActuelle",
  ]);

  const nouvellesPlacesScolaire = (() => {
    return differenceCapacité(capaciteScolaire, capaciteScolaireActuelle);
  })();

  const nouvellesPlacesApprentissage = (() => {
    return differenceCapacité(
      capaciteApprentissage,
      capaciteApprentissageActuelle
    );
  })();

  return (
    <Flex maxW="752px" gap="6" mb="6" direction={"column"}>
      <MixteField disabled={disabled} />
      <ColorationField disabled={disabled} />
      <LibelleColorationField disabled={disabled} />
      <Table maxW={752} columnGap={1} rowGap={1}>
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
                Dont colorée
              </Th>
            )}
            <Th textAlign={"end"} p={2} pe={0}>
              Nouvelle place
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr border={"none"}>
            <Td p={2} bgColor={"grey.975"} border={"1px solid gray.200"}>
              Capacité en voie scolaire
            </Td>
            <Td p={0} border={"none"}>
              <CapaciteScolaireActuelleField
                disabled={disabled}
                maxW={240}
                flex={1}
              />
            </Td>
            <Td p={0} border={"none"}>
              <CapaciteScolaireField disabled={disabled} maxW={240} flex={1} />
            </Td>
            {coloration && (
              <Td p={0} border={"none"}>
                <CapaciteScolaireColoreeField
                  disabled={disabled}
                  maxW={240}
                  flex={1}
                />
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
              <CapaciteApprentissageActuelleField
                disabled={disabled}
                maxW={240}
                flex={1}
              />
            </Td>
            <Td p={0} border={"none"}>
              <CapaciteApprentissageField
                disabled={disabled}
                maxW={240}
                flex={1}
              />
            </Td>
            {coloration && (
              <Td p={0} border={"none"}>
                <CapaciteApprentissageColoreeField
                  disabled={disabled}
                  maxW={240}
                  flex={1}
                />
              </Td>
            )}
            <Td p={0} border={"none"}>
              <ConstanteField value={nouvellesPlacesApprentissage} />
            </Td>
          </Tr>
        </Tbody>
      </Table>
      {}
    </Flex>
  );
};
