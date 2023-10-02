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

import {
  isTypeAugmentation,
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
    color="#000091"
    fontWeight={"bold"}
    isDisabled
    value={Number.isNaN(value) ? undefined : value}
    maxW={496}
  />
);

const differenceCapacité = (
  valueA: number | undefined,
  valueB: number | undefined = 0
) => {
  if (valueB === undefined || valueA === undefined) return "-";
  if (valueA < valueB) return "-";
  return valueA - valueB;
};

const ConstanteSection = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => {
  return (
    <>
      <FormControl mb="8">
        <FormLabel>{label}</FormLabel>
        <ConstanteField value={value} />
      </FormControl>
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
  const isTransfertApprentissage = watch("motif")?.includes(
    "transfert_apprentissage"
  );

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
      <Heading fontSize="lg" mb="6" mt="10" color="bluefrance.113">
        Capacité en voie scolaire {mixte ? " uniquement" : null}
      </Heading>
      <Flex mb="4" gap={4}>
        <CapaciteScolaireActuelleField maxW={240} flex={1} />
        <CapaciteScolaireField maxW={240} flex={1} />
        <CapaciteScolaireColoreeField maxW={240} flex={1} />
      </Flex>
      <ConstanteSection
        label={
          isTypeOuverture(typeDemande) || isTypeAugmentation(typeDemande)
            ? "Nombre de nouvelles places"
            : "Nombre de places fermées"
        }
        value={
          isTypeOuverture(typeDemande) || isTypeAugmentation(typeDemande)
            ? differenceCapacité(capaciteScolaire, capaciteScolaireActuelle)
            : differenceCapacité(capaciteScolaireActuelle, capaciteScolaire)
        }
      />
      {mixte && (
        <>
          <Heading mt="10" fontSize="lg" mb="6" color="bluefrance.113">
            Capacité en apprentissage
          </Heading>
          <Flex gap={4} mb="4">
            <CapaciteApprentissageActuelleField maxW={240} flex={1} />
            <CapaciteApprentissageField maxW={240} flex={1} />
            <CapaciteApprentissageColoreeField maxW={240} flex={1} />
          </Flex>
          <ConstanteSection
            label={
              isTransfertApprentissage
                ? "Nombre de places transférées"
                : isTypeOuverture(typeDemande) ||
                  isTypeAugmentation(typeDemande)
                ? "Nombre de nouvelles places"
                : "Nombre de places fermées"
            }
            value={
              isTransfertApprentissage ||
              isTypeOuverture(typeDemande) ||
              isTypeAugmentation(typeDemande)
                ? differenceCapacité(
                    capaciteApprentissage,
                    capaciteApprentissageActuelle
                  )
                : differenceCapacité(
                    capaciteApprentissageActuelle,
                    capaciteApprentissage
                  )
            }
          />
        </>
      )}
      <CommentaireField mt={12} maxW={752} />
    </>
  );
};
