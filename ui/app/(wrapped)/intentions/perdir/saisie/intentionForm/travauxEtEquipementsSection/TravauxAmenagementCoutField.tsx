import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";

export const TravauxAmenagementCoutField = chakra(
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
          if (name !== "travauxAmenagement") return;
          setValue("travauxAmenagementCout", undefined);
        }).unsubscribe
    );

    const travauxAmenagement = watch("travauxAmenagement");
    const visible = !!travauxAmenagement;
    if (!visible) return null;

    return (
      <FormControl className={className} isInvalid={!!errors.travauxAmenagementCout}>
        <FormLabel>Quel est le coût estimé de ces travaux d'aménagement (en euros) ?</FormLabel>
        <NumberInput w="sm" onFocus={(e) => e.currentTarget.select()}>
          <NumberInputField
            {...register("travauxAmenagementCout", {
              shouldUnregister: true,
              disabled: disabled,
              pattern: /^\d+$/,
            })}
            placeholder="Montant (en €)"
          />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        {errors.travauxAmenagementCout && <FormErrorMessage>{errors.travauxAmenagementCout.message}</FormErrorMessage>}
      </FormControl>
    );
  }
);
