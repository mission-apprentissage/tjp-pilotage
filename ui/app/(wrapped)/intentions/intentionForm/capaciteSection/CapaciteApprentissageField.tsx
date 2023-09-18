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

export const CapaciteApprentissageField = chakra(
  ({ className }: { className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
    } = useFormContext<IntentionForms[2]>();

    const typeDemande = watch("typeDemande");
    const ouverture = isTypeOuverture(typeDemande);

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.capaciteApprentissage}
        isRequired
      >
        <FormLabel>
          {ouverture ? "Capacité prévisionnelle" : "Nouvelle capacité"}
        </FormLabel>
        <Input
          type="number"
          {...register("capaciteApprentissage", {
            required: "La capacité apprentissage est obligatoire",
            setValueAs: (value) => parseInt(value) || undefined,
          })}
          placeholder="0"
        />
        {errors.capaciteApprentissage && (
          <FormErrorMessage>
            {errors.capaciteApprentissage.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
