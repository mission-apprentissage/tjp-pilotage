import {
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { AmiCmaField } from "@/app/(wrapped)/intentions/intentionForm/capaciteSection/AmiCmaField";
import { CapaciteApprentissageActuelleField } from "@/app/(wrapped)/intentions/intentionForm/capaciteSection/CapaciteApprentissageActuelleField";
import { CapaciteScolaireActuelleField } from "@/app/(wrapped)/intentions/intentionForm/capaciteSection/CapaciteScolaireActuelleField";
import { CommentaireField } from "@/app/(wrapped)/intentions/intentionForm/capaciteSection/CommentaireField";
import { LibelleColorationField } from "@/app/(wrapped)/intentions/intentionForm/capaciteSection/LibelleColorationField";
import { MixteField } from "@/app/(wrapped)/intentions/intentionForm/capaciteSection/MixteField";
import { PoursuitePedagogiqueField } from "@/app/(wrapped)/intentions/intentionForm/capaciteSection/PoursuitePedagogique";
import { IntentionForms } from "@/app/(wrapped)/intentions/intentionForm/defaultFormValues";
import { InfoBox } from "@/app/(wrapped)/intentions/intentionForm/InfoBox";

import {
  isTypeAugmentation,
  isTypeDiminution,
  isTypeFermeture,
  isTypeOuverture,
} from "../../utils/typeDemandeUtils";
import { CapaciteApprentissageColoreeField } from "./CapaciteApprentissageColoreeField";
import { CapaciteApprentissageField } from "./CapaciteApprentissageField";
import { CapaciteScolaireColoreeField } from "./CapaciteScolaireColoreeField";
import { CapaciteScolaireField } from "./CapaciteScolaireField";
import { ColorationField } from "./ColorationField";

const ConstanteField = ({ value }: { value: string | number | undefined }) => (
  <Input
    opacity="1!important"
    bg="#ABB8DE"
    color="white"
    isDisabled
    value={value}
    maxW={496}
  />
);

const differenceCapacité = (
  capaciteActuelle: number | undefined,
  capacite: number | undefined
) => {
  if (capaciteActuelle === undefined || capacite === undefined) return "-";
  if (capacite >= capaciteActuelle) return capacite - capaciteActuelle;
  return capacite - capaciteActuelle;
};

const ConstanteSection = ({
  typeDemande,
  capaciteActuelle,
  capacite,
}: {
  typeDemande: string;
  capaciteActuelle?: number;
  capacite?: number;
}) => {
  return (
    <>
      {(isTypeOuverture(typeDemande) || isTypeAugmentation(typeDemande)) && (
        <FormControl mb="8">
          <FormLabel>Nombre de nouvelles places</FormLabel>
          <ConstanteField
            value={differenceCapacité(capaciteActuelle, capacite)}
          />
        </FormControl>
      )}
      {(isTypeDiminution(typeDemande) || isTypeFermeture(typeDemande)) && (
        <FormControl mb="8">
          <FormLabel>Nombre de places fermées</FormLabel>
          <ConstanteField
            value={differenceCapacité(capacite, capaciteActuelle)}
          />
        </FormControl>
      )}
    </>
  );
};

export const CapaciteSection = () => {
  const { watch } = useFormContext<IntentionForms>();

  const [capaciteScolaire, capaciteScolaireActuelle] = watch([
    "capaciteScolaire",
    "capaciteScolaireActuelle",
  ]);
  const [capaciteApprentissage, capaciteApprentissageActuelle] = watch([
    "capaciteApprentissage",
    "capaciteApprentissageActuelle",
  ]);

  const typeDemande = watch("typeDemande");
  const mixte = watch("mixte");

  return (
    <>
      <Heading as="h2" fontSize="xl">
        Précisions sur votre demande et saisie de la capacité
      </Heading>
      <Divider pt="4" mb="4" />
      {!isTypeFermeture(typeDemande) && (
        <Flex maxW="752px" gap="6" mb="6">
          <MixteField />
          <PoursuitePedagogiqueField />
        </Flex>
      )}
      <Flex maxW="752px" gap="6" mb="6">
        <ColorationField />
        <AmiCmaField />
      </Flex>
      <LibelleColorationField maxW="752px" mb="4" />
      <Heading fontSize="lg" mb="6" mt="8" color="bluefrance.113">
        Capacité en voie scolaire {mixte ? " uniquement" : null}
      </Heading>
      <Flex mb="8">
        <Flex w={752} gap={4}>
          <CapaciteScolaireActuelleField maxW={240} flex={1} />
          <CapaciteScolaireField maxW={240} flex={1} />
          <CapaciteScolaireColoreeField maxW={240} flex={1} />
        </Flex>
        {mixte && (
          <InfoBox flex="1" mt="8" ms="6" p={"16px"}>
            Pour une formation pouvant accueillir 30 élèves dont 20 en
            apprentissage, remplir 10 dans le champ capacité en voie scolaire et
            20 dans le champ capacité en apprentissage.
          </InfoBox>
        )}
      </Flex>
      <ConstanteSection
        typeDemande={typeDemande}
        capaciteActuelle={capaciteScolaireActuelle}
        capacite={capaciteScolaire}
      />
      {mixte && (
        <>
          <Heading mt="8" fontSize="lg" mb="6" color="bluefrance.113">
            Capacité en apprentissage
          </Heading>
          <Flex gap={4} mb="8">
            <CapaciteApprentissageActuelleField maxW={240} flex={1} />
            <CapaciteApprentissageField maxW={240} flex={1} />
            <CapaciteApprentissageColoreeField maxW={240} flex={1} />
          </Flex>
          <ConstanteSection
            typeDemande={typeDemande}
            capaciteActuelle={capaciteApprentissageActuelle}
            capacite={capaciteApprentissage}
          />
        </>
      )}
      <Flex align={"flex-start"} mt={8}>
        <CommentaireField maxW={752} />
        <InfoBox flex="1" mt="8" ml="6">
          Toutes les précisions et observations utiles pour comprendre votre
          demande. Vous pouvez par exemple préciser le numéro d’une autre
          demande si les deux demandes sont liées.
        </InfoBox>
      </Flex>
    </>
  );
};
