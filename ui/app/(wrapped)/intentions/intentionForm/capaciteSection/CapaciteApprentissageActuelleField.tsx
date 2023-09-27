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

export const CapaciteApprentissageActuelleField = chakra(
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
            isInvalid={!!errors.capaciteApprentissageActuelle}
            isRequired
          >
            <FormLabel>Capacité actuelle</FormLabel>
            <Input
              type="number"
              {...register("capaciteApprentissageActuelle", {
                required: "Le champ est obligatoire",
                setValueAs: (value) => parseInt(value) || undefined,
                validate: (value) => {
                  if (Number.isNaN(value))
                    return "Veuillez remplir un nombre valide.";
                  if (value && value < 0)
                    return "Valeurs positives uniquement.";
                },
              })}
            />
            {errors.capaciteApprentissageActuelle && (
              <FormErrorMessage>
                {errors.capaciteApprentissageActuelle.message}
              </FormErrorMessage>
            )}
          </FormControl>
        )}
      </>
    );
  }
);
