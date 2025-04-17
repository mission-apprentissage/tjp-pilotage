import { Flex, Input, Table, Tbody, Td, Th, Thead, Tr, VisuallyHidden } from "@chakra-ui/react";
import { isTypeColoration } from "shared/utils/typeDemandeUtils";

import type { Demande } from "@/app/(wrapped)/demandes/types";

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

export const CapaciteConstanteSection = ({ demande }: { demande: Demande }) => {
  const typeDemande = demande?.typeDemande;
  const coloration = typeDemande !== undefined && (isTypeColoration(typeDemande) || demande.coloration);
  return (
    <Flex gap="6" mb="6" direction={"column"}>
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
              <VisuallyHidden as="label" htmlFor="intentionCapaciteScolaireActuelle">Capacité scolaire actuelle de la demande d'origine</VisuallyHidden>
              <ConstanteField id={"intentionCapaciteScolaireActuelle"} value={demande.capaciteScolaireActuelle} />
            </Td>
            <Td p={0} border={"none"}>
              <VisuallyHidden as="label" htmlFor="intentionCapaciteScolaire">Capacité scolaire de la demande d'origine</VisuallyHidden>
              <ConstanteField id={"intentionCapaciteScolaire"} value={demande.capaciteScolaire} />
            </Td>
            {coloration && (
              <>
                <Td p={0} border={"none"}>
                  <VisuallyHidden as="label" htmlFor="intentionCapaciteScolaireColoreeActuelle">Capacité scolaire colorée actuelle de la demande d'origine</VisuallyHidden>
                  <ConstanteField id={"intentionCapaciteScolaireColoreeActuelle"} value={demande.capaciteScolaireColoreeActuelle} />
                </Td>
                <Td p={0} border={"none"}>
                  <VisuallyHidden as="label" htmlFor="intentionCapaciteScolaireColoree">Capacité scolaire colorée de la demande d'origine</VisuallyHidden>
                  <ConstanteField id={"intentionCapaciteScolaire"} value={demande.capaciteScolaireColoree} />
                </Td>
              </>
            )}
            <Td p={0} border={"none"}>
              <VisuallyHidden as="label" htmlFor="intentionNouvellesPlacesScolaire">Nouvelles places scolaire de la demande d'origine</VisuallyHidden>
              <ConstanteField id={"intentionNouvellesPlacesScolaire"} value={differenceCapacité(demande.capaciteScolaire, demande.capaciteScolaireActuelle)} />
            </Td>
          </Tr>
          <Tr border={"none"}>
            <Td p={2} bgColor={"grey.975"} border={"1px solid gray.200"}>
              Capacité en apprentissage
            </Td>
            <Td p={0} border={"none"}>
              <VisuallyHidden as="label" htmlFor="intentionCapaciteApprentissage">Capacité en apprentissage de la demande d'origine</VisuallyHidden>
              <ConstanteField id={"intentionCapaciteApprentissage"} value={demande.capaciteApprentissageActuelle} />
            </Td>
            <Td p={0} border={"none"}>
              <VisuallyHidden as="label" htmlFor="intentionCapaciteApprentissageActuelle">Capacité en apprentissage actuelle de la demande d'origine</VisuallyHidden>
              <ConstanteField id={"intentionCapaciteApprentissageActuelle"} value={demande.capaciteApprentissage} />
            </Td>
            {coloration && (
              <>
                <Td p={0} border={"none"}>
                  <VisuallyHidden as="label" htmlFor="intentionCapaciteApprentissageColoreeActuelle">Capacité en apprentissage colorée actuelle de la demande d'origine</VisuallyHidden>
                  <ConstanteField id={"intentionCapaciteApprentissageColoreeActuelle"} value={demande.capaciteApprentissageColoreeActuelle} />
                </Td>
                <Td p={0} border={"none"}>
                  <VisuallyHidden as="label" htmlFor="intentionCapaciteApprentissageColoree">Capacité en apprentissage colorée de la demande d'origine</VisuallyHidden>
                  <ConstanteField id={"intentionCapaciteApprentissageColoree"} value={demande.capaciteApprentissageColoree} />
                </Td>
              </>
            )}
            <Td p={0} border={"none"}>
              <VisuallyHidden as="label" htmlFor="intentionNouvellesPlacesApprentissage">Nouvelles places en apprentissage de la demande d'origine</VisuallyHidden>
              <ConstanteField
                id={"intentionNouvellesPlacesApprentissage"}
                value={differenceCapacité(demande.capaciteApprentissage, demande.capaciteApprentissageActuelle)}
              />
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Flex>
  );
};
