import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "../defaultFormValues";

export const CapaciteApprentissageColoreeField = chakra(
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
            isInvalid={!!errors.capaciteApprentissageColoree}
            isRequired
          >
            <FormLabel>Dont places colorées</FormLabel>
            <Input
              type="number"
              {...register("capaciteApprentissageColoree", {
                setValueAs: (value) => parseInt(value) || undefined,
              })}
              placeholder="0"
            />
            {errors.capaciteApprentissageColoree && (
              <FormErrorMessage>
                {errors.capaciteApprentissageColoree.message}
              </FormErrorMessage>
            )}
          </FormControl>
        )}
      </>
    );
  }
);
