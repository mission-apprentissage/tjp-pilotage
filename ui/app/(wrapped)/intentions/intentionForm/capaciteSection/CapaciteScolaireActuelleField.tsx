import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { isTypeOuverture } from "../../utils/typeDemandeUtils";
import { IntentionForms } from "../defaultFormValues";

export const CapaciteScolaireActuelleField = chakra(
  ({ className }: { className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
    } = useFormContext<IntentionForms>();

    const typeDemande = watch("typeDemande");
    const ouverture = isTypeOuverture(typeDemande);

    return (
      <>
        {!ouverture && (
          <FormControl
            className={className}
            isInvalid={!!errors.capaciteScolaireActuelle}
            isRequired
          >
            <FormLabel>Capacité actuelle</FormLabel>
            <Input
              type="number"
              {...register("capaciteScolaireActuelle", {
                setValueAs: (value) => parseInt(value) || undefined,
                validate: (value) => {
                  if (value === undefined) return "Le champ est obligatoire";
                  if (Number.isNaN(value))
                    return "Veuillez remplir un nombre valide.";
                  if (value < 0) return "Valeurs positives uniquement.";
                },
              })}
            />
            {errors.capaciteScolaireActuelle && (
              <FormErrorMessage>
                {errors.capaciteScolaireActuelle.message}
              </FormErrorMessage>
            )}
          </FormControl>
        )}
      </>
    );
  }
);
