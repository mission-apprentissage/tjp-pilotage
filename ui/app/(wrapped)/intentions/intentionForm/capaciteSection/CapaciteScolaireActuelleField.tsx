import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "../defaultFormValues";
import { isTypeOuverture } from "../isTypeOuverture";

export const CapaciteScolaireActuelleField = chakra(
  ({ className }: { className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
    } = useFormContext<IntentionForms[2]>();

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
              {...register("capaciteScolaireActuelle", {
                required: "La capacité scolaire actuelle est obligatoire",
                setValueAs: (value) => parseInt(value) || undefined,
              })}
              placeholder="0"
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
