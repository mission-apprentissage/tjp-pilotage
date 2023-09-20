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

export const CapaciteScolaireField = chakra(
  ({ className }: { className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
    } = useFormContext<IntentionForms>();

    const typeDemande = watch("typeDemande");
    const ouverture = isTypeOuverture(typeDemande);

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.capaciteScolaire}
        isRequired
      >
        <FormLabel>
          {ouverture ? "Capacité prévisionnelle" : "Nouvelle capacité"}
        </FormLabel>
        <Input
          type="number"
          {...register("capaciteScolaire", {
            required: "La capacité scolaire est obligatoire",
            setValueAs: (value) => parseInt(value) || undefined,
          })}
          placeholder="0"
        />
        {errors.capaciteScolaire && (
          <FormErrorMessage>{errors.capaciteScolaire.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
