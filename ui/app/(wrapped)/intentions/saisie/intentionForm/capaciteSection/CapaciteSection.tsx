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

import {
  getTypeDemandeLabel,
  isTypeAugmentation,
  isTypeOuverture,
  TypeDemande,
} from "../../../utils/typeDemandeUtils";
import { IntentionForms } from "../defaultFormValues";
import { AmiCmaField } from "./AmiCmaField";
import { AmiCmaValideAnneeField } from "./AmiCmaValideAnneeField";
import { AmiCmaValideField } from "./AmiCmaValideField";
import { CapaciteApprentissageActuelleField } from "./CapaciteApprentissageActuelleField";
import { CapaciteApprentissageColoreeField } from "./CapaciteApprentissageColoreeField";
import { CapaciteApprentissageField } from "./CapaciteApprentissageField";
import { CapaciteScolaireActuelleField } from "./CapaciteScolaireActuelleField";
import { CapaciteScolaireColoreeField } from "./CapaciteScolaireColoreeField";
import { CapaciteScolaireField } from "./CapaciteScolaireField";
import { ColorationField } from "./ColorationField";
import { CommentaireField } from "./CommentaireField";
import { LibelleColorationField } from "./LibelleColorationField";
import { MixteField } from "./MixteField";

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
        <Flex>
          &nbsp;d'
          {
            <Text color="bluefrance.113">
              &nbsp;{getTypeDemandeLabel(typeDemande)}
            </Text>
          }
          &nbsp;
        </Flex>
      );
    case "diminution":
    case "fermeture":
    case "transfert":
      return (
        <Flex>
          &nbsp;de
          {
            <Text color="bluefrance.113">
              &nbsp;{getTypeDemandeLabel(typeDemande)}
            </Text>
          }
          &nbsp;
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
        <ColorationField disabled={disabled} />
        <LibelleColorationField disabled={disabled} maxW="752px" mb="4" />
        <AmiCmaField disabled={disabled} />
        <AmiCmaValideField disabled={disabled} />
        <AmiCmaValideAnneeField disabled={disabled} />
      </Flex>
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
