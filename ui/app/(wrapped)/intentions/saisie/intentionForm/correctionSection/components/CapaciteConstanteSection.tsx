import { Flex, Input, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

import type { Intention } from "@/app/(wrapped)/intentions/saisie/intentionForm/correctionSection/types";
import { isTypeColoration } from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";

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

const differenceCapacité = (valueA: number | undefined, valueB: number | undefined = 0) => {
  if (valueB === undefined || valueA === undefined) return "-";
  return valueA - valueB > 0 ? `+${valueA - valueB}` : valueA - valueB;
};

export const CapaciteConstanteSection = ({ demande }: { demande: Intention }) => {
  const typeDemande = demande?.typeDemande;
  const coloration = typeDemande !== undefined && (isTypeColoration(typeDemande) || demande.coloration);
  return (
    <Flex gap="6" mb="6" direction={"column"}>
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
                Dont colorée
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
              <ConstanteField value={demande.capaciteScolaireActuelle} />
            </Td>
            <Td p={0} border={"none"}>
              <ConstanteField value={demande.capaciteScolaire} />
            </Td>
            {coloration && (
              <Td p={0} border={"none"}>
                <ConstanteField value={demande.capaciteScolaireColoree} />
              </Td>
            )}
            <Td p={0} border={"none"}>
              <ConstanteField value={differenceCapacité(demande.capaciteScolaire, demande.capaciteScolaireActuelle)} />
            </Td>
          </Tr>
          <Tr border={"none"}>
            <Td p={2} bgColor={"grey.975"} border={"1px solid gray.200"}>
              Capacité en apprentissage
            </Td>
            <Td p={0} border={"none"}>
              <ConstanteField value={demande.capaciteApprentissageActuelle} />
            </Td>
            <Td p={0} border={"none"}>
              <ConstanteField value={demande.capaciteApprentissage} />
            </Td>
            {coloration && (
              <Td p={0} border={"none"}>
                <ConstanteField value={demande.capaciteApprentissageColoree} />
              </Td>
            )}
            <Td p={0} border={"none"}>
              <ConstanteField
                value={differenceCapacité(demande.capaciteApprentissage, demande.capaciteApprentissageActuelle)}
              />
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Flex>
  );
};
