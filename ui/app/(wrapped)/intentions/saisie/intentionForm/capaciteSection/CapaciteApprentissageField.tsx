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

import {
  isTypeFermeture,
  isTypeOuverture,
} from "@/app/(wrapped)/intentions/utils/typeDemandeUtils";

import { safeParseInt } from "../../utils/safeParseInt";
import { IntentionForms } from "../defaultFormValues";

export const CapaciteApprentissageField = chakra(
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
          setValue("capaciteApprentissage", undefined);
        }).unsubscribe
    );

    const [typeDemande, motif] = watch(["typeDemande", "motif"]);
    const ouverture = isTypeOuverture(typeDemande);
    const fermeture = isTypeFermeture(typeDemande);
    const isTransfertApprentissage =
      motif?.includes("transfert_apprentissage") ?? false;

    if (fermeture && !isTransfertApprentissage) return <></>;

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.capaciteApprentissage}
        isRequired
      >
        <FormLabel>
          {ouverture ? "Capacité prévisionnelle" : "Nouvelle capacité"}
        </FormLabel>
        <NumberInput>
          <NumberInputField
            {...register("capaciteApprentissage", {
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
        {errors.capaciteApprentissage && (
          <FormErrorMessage>
            {errors.capaciteApprentissage.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
