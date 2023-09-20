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
            <FormLabel>Capacité apprentissage</FormLabel>
            <Input
              type="number"
              {...register("capaciteApprentissageActuelle", {
                required: "La capacité apprentissage actuelle est obligatoire",
                setValueAs: (value) => parseInt(value) || undefined,
              })}
              placeholder="0"
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
