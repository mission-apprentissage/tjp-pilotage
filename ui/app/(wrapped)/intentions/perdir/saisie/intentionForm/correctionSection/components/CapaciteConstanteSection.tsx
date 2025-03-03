import { Flex, Input, Table, Tbody, Td, Th, Thead, Tr, VisuallyHidden } from "@chakra-ui/react";
import { isTypeColoration } from "shared/utils/typeDemandeUtils";

import type { Intention } from "@/app/(wrapped)/intentions/perdir/types";
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

export const CapaciteConstanteSection = ({ intention }: { intention: Intention }) => {
  const typeDemande = intention?.typeDemande;
  const coloration = typeDemande !== undefined && (isTypeColoration(typeDemande) || intention.coloration);
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
              <VisuallyHidden as="label" htmlFor="intentionCapaciteScolaireActuelle">Capacité scolaire actuelle de la intention d'origine</VisuallyHidden>
              <ConstanteField id={"intentionCapaciteScolaireActuelle"} value={intention.capaciteScolaireActuelle} />
            </Td>
            <Td p={0} border={"none"}>
              <VisuallyHidden as="label" htmlFor="intentionCapaciteScolaire">Capacité scolaire de la intention d'origine</VisuallyHidden>
              <ConstanteField id={"intentionCapaciteScolaire"} value={intention.capaciteScolaire} />
            </Td>
            {coloration && (
              <>
                <Td p={0} border={"none"}>
                  <VisuallyHidden as="label" htmlFor="intentionCapaciteScolaireColoreeActuelle">Capacité scolaire colorée actuelle de la intention d'origine</VisuallyHidden>
                  <ConstanteField id={"intentionCapaciteScolaireColoreeActuelle"} value={intention.capaciteScolaireColoreeActuelle} />
                </Td>
                <Td p={0} border={"none"}>
                  <VisuallyHidden as="label" htmlFor="intentionCapaciteScolaireColoree">Capacité scolaire colorée de la intention d'origine</VisuallyHidden>
                  <ConstanteField id={"intentionCapaciteScolaire"} value={intention.capaciteScolaireColoree} />
                </Td>
              </>
            )}
            <Td p={0} border={"none"}>
              <VisuallyHidden as="label" htmlFor="intentionNouvellesPlacesScolaire">Nouvelles places scolaire de la intention d'origine</VisuallyHidden>
              <ConstanteField id={"intentionNouvellesPlacesScolaire"} value={differenceCapacité(intention.capaciteScolaire, intention.capaciteScolaireActuelle)} />
            </Td>
          </Tr>
          <Tr border={"none"}>
            <Td p={2} bgColor={"grey.975"} border={"1px solid gray.200"}>
              Capacité en apprentissage
            </Td>
            <Td p={0} border={"none"}>
              <VisuallyHidden as="label" htmlFor="intentionCapaciteApprentissage">Capacité en apprentissage de la intention d'origine</VisuallyHidden>
              <ConstanteField id={"intentionCapaciteApprentissage"} value={intention.capaciteApprentissageActuelle} />
            </Td>
            <Td p={0} border={"none"}>
              <VisuallyHidden as="label" htmlFor="intentionCapaciteApprentissageActuelle">Capacité en apprentissage actuelle de la intention d'origine</VisuallyHidden>
              <ConstanteField id={"intentionCapaciteApprentissageActuelle"} value={intention.capaciteApprentissage} />
            </Td>
            {coloration && (
              <>
                <Td p={0} border={"none"}>
                  <VisuallyHidden as="label" htmlFor="intentionCapaciteApprentissageColoreeActuelle">Capacité en apprentissage colorée actuelle de la intention d'origine</VisuallyHidden>
                  <ConstanteField id={"intentionCapaciteApprentissageColoreeActuelle"} value={intention.capaciteApprentissageColoreeActuelle} />
                </Td>
                <Td p={0} border={"none"}>
                  <VisuallyHidden as="label" htmlFor="intentionCapaciteApprentissageColoree">Capacité en apprentissage colorée de la intention d'origine</VisuallyHidden>
                  <ConstanteField id={"intentionCapaciteApprentissageColoree"} value={intention.capaciteApprentissageColoree} />
                </Td>
              </>
            )}
            <Td p={0} border={"none"}>
              <VisuallyHidden as="label" htmlFor="intentionNouvellesPlacesApprentissage">Nouvelles places en apprentissage de la intention d'origine</VisuallyHidden>
              <ConstanteField
                id={"intentionNouvellesPlacesApprentissage"}
                value={differenceCapacité(intention.capaciteApprentissage, intention.capaciteApprentissageActuelle)}
              />
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Flex>
  );
};
