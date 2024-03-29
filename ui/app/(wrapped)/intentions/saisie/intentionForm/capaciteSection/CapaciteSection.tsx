import {
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { useFormContext } from "react-hook-form";

import { AmiCmaField } from "@/app/(wrapped)/intentions/saisie/intentionForm/capaciteSection/AmiCmaField";
import { CapaciteApprentissageActuelleField } from "@/app/(wrapped)/intentions/saisie/intentionForm/capaciteSection/CapaciteApprentissageActuelleField";
import { CapaciteScolaireActuelleField } from "@/app/(wrapped)/intentions/saisie/intentionForm/capaciteSection/CapaciteScolaireActuelleField";
import { CommentaireField } from "@/app/(wrapped)/intentions/saisie/intentionForm/capaciteSection/CommentaireField";
import { LibelleColorationField } from "@/app/(wrapped)/intentions/saisie/intentionForm/capaciteSection/LibelleColorationField";
import { MixteField } from "@/app/(wrapped)/intentions/saisie/intentionForm/capaciteSection/MixteField";
import { PoursuitePedagogiqueField } from "@/app/(wrapped)/intentions/saisie/intentionForm/capaciteSection/PoursuitePedagogique";
import { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";
import {
  getTypeDemandeLabel,
  TypeDemande,
} from "@/app/(wrapped)/utils/typeDemandeUtils";

import {
  isTypeAugmentation,
  isTypeFermeture,
  isTypeOuverture,
} from "../../../../utils/typeDemandeUtils";
import { AmiCmaValideAnneeField } from "./AmiCmaValideAnneeField";
import { AmiCmaValideField } from "./AmiCmaValideField";
import { CapaciteApprentissageColoreeField } from "./CapaciteApprentissageColoreeField";
import { CapaciteApprentissageField } from "./CapaciteApprentissageField";
import { CapaciteScolaireColoreeField } from "./CapaciteScolaireColoreeField";
import { CapaciteScolaireField } from "./CapaciteScolaireField";
import { ColorationField } from "./ColorationField";

const getTypeDemandeLabelAvecDeterminant = (
  typeDemande?: TypeDemande
): ReactNode => {
  if (!typeDemande) return "";
  switch (typeDemande) {
    case "ouverture_nette":
    case "augmentation_nette":
    case "augmentation_compensation":
    case "ouverture_compensation":
      return (
        <Flex mx={1}>
          d'
          {
            <Text color="bluefrance.113">
              {getTypeDemandeLabel(typeDemande)}
            </Text>
          }
        </Flex>
      );
    case "diminution":
    case "fermeture":
    case "transfert":
      return (
        <Flex mx={1}>
          de
          {
            <Text color="bluefrance.113">
              {getTypeDemandeLabel(typeDemande)}
            </Text>
          }
        </Flex>
      );
    default:
      return "";
  }
};

const ConstanteField = ({ value }: { value: string | number | undefined }) => (
  <Input
    opacity="1!important"
    bg="blueecume.675_hover"
    color="bluefrance.113"
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

export const CapaciteSection = ({ disabled }: { disabled: boolean }) => {
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
      <Heading as="h2" fontSize="xl" display={"flex"}>
        Précisions sur votre demande{" "}
        {getTypeDemandeLabelAvecDeterminant(typeDemande)} et saisie de la
        capacité
      </Heading>
      <Divider pt="4" mb="4" />
      <Flex maxW="752px" gap="6" mb="6" direction={"column"}>
        <MixteField disabled={disabled} />
        {!isTypeFermeture(typeDemande) && (
          <PoursuitePedagogiqueField disabled={disabled} />
        )}
        <ColorationField disabled={disabled} />
        <AmiCmaField disabled={disabled} />
        <AmiCmaValideField disabled={disabled} />
        <AmiCmaValideAnneeField disabled={disabled} />
      </Flex>
      <LibelleColorationField disabled={disabled} maxW="752px" mb="4" />
      <Heading fontSize="lg" mb="6" mt="10" color="bluefrance.113">
        Capacité en voie scolaire {mixte ? " uniquement" : null}
      </Heading>
      <Flex mb="4" gap={4}>
        <CapaciteScolaireActuelleField
          disabled={disabled}
          maxW={240}
          flex={1}
        />
        <CapaciteScolaireField disabled={disabled} maxW={240} flex={1} />
        <CapaciteScolaireColoreeField disabled={disabled} maxW={240} flex={1} />
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
            <CapaciteApprentissageActuelleField
              disabled={disabled}
              maxW={240}
              flex={1}
            />
            <CapaciteApprentissageField
              disabled={disabled}
              maxW={240}
              flex={1}
            />
            <CapaciteApprentissageColoreeField
              disabled={disabled}
              maxW={240}
              flex={1}
            />
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
      <CommentaireField disabled={disabled} mt={12} maxW={752} />
    </>
  );
};
