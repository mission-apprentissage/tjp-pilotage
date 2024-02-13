import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { isTypeOuverture } from "../../../../utils/typeDemandeUtils";
import { safeParseInt } from "../../utils/safeParseInt";
import { IntentionForms } from "../defaultFormValues";

export const CapaciteApprentissageActuelleField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
      setValue,
    } = useFormContext<IntentionForms>();

    useEffect(
      () =>
        watch((_, { name }) => {
          if (name !== "typeDemande") return;
          setValue("capaciteApprentissageActuelle", undefined);
        }).unsubscribe
    );

    const typeDemande = watch("typeDemande");
    const ouverture = isTypeOuverture(typeDemande);
    if (ouverture) return <></>;

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.capaciteApprentissageActuelle}
        isRequired
      >
        <FormLabel>Capacité actuelle</FormLabel>
        <NumberInput>
          <NumberInputField
            {...register("capaciteApprentissageActuelle", {
              shouldUnregister: true,
              disabled,
              setValueAs: safeParseInt,
              validate: (value) => {
                if (value === undefined) return "Le champ est obligatoire";
                if (Number.isNaN(value))
                  return "Veuillez remplir un nombre valide.";
                if (value < 0) return "Valeurs positives uniquement.";
                return;
              },
            })}
          />
        </NumberInput>
        {errors.capaciteApprentissageActuelle && (
          <FormErrorMessage>
            {errors.capaciteApprentissageActuelle.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
