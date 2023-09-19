import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "../defaultFormValues";

export const CapaciteScolaireColoreeField = chakra(
  ({ className }: { className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
    } = useFormContext<IntentionForms[2]>();

    const [coloration] = watch(["coloration"]);

    return (
      <>
        {coloration && (
          <FormControl
            className={className}
            isInvalid={!!errors.capaciteScolaireColoree}
            isRequired
          >
            <FormLabel>Dont places colorées</FormLabel>
            <Input
              type="number"
              {...register("capaciteScolaireColoree", {
                required: "La capacité scolaire est obligatoire",
                setValueAs: (value) => parseInt(value) || undefined,
              })}
              placeholder="0"
            />
            {errors.capaciteScolaireColoree && (
              <FormErrorMessage>
                {errors.capaciteScolaireColoree.message}
              </FormErrorMessage>
            )}
          </FormControl>
        )}
      </>
    );
  }
);
