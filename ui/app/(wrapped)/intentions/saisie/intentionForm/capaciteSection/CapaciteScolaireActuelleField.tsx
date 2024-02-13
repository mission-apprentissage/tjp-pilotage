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

export const CapaciteScolaireActuelleField = chakra(
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
          setValue("capaciteScolaireActuelle", undefined);
        }).unsubscribe
    );

    const typeDemande = watch("typeDemande");
    const ouverture = isTypeOuverture(typeDemande);
    if (ouverture) return <></>;

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.capaciteScolaireActuelle}
        isRequired
      >
        <FormLabel>Capacité actuelle</FormLabel>
        <NumberInput>
          <NumberInputField
            {...register("capaciteScolaireActuelle", {
              shouldUnregister: true,
              disabled,
              setValueAs: safeParseInt,
              validate: (value) => {
                if (value === undefined) return "Le champ est obligatoire";
                if (Number.isNaN(value))
                  return "Veuillez remplir un nombre valide.";
                if (value < 0) return "Valeurs positives uniquement.";
              },
            })}
          />
        </NumberInput>
        {errors.capaciteScolaireActuelle && (
          <FormErrorMessage>
            {errors.capaciteScolaireActuelle.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
