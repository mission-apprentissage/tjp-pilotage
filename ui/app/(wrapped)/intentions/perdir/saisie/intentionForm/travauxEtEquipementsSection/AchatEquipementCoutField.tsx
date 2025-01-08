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

export const AchatEquipementCoutField = chakra(
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
          if (name !== "achatEquipement") return;
          setValue("achatEquipementCout", undefined);
        }).unsubscribe,
    );

    const achatEquipement = watch("achatEquipement");
    const visible = !!achatEquipement;
    if (!visible) return null;

    return (
      <FormControl className={className} isInvalid={!!errors.achatEquipementCout}>
        <FormLabel>Quel est le coût estimé de ces achats d'équipement (en euros) ?</FormLabel>
        <NumberInput w="sm" onFocus={(e) => e.currentTarget.select()}>
          <NumberInputField
            {...register("achatEquipementCout", {
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
        {errors.achatEquipementCout && <FormErrorMessage>{errors.achatEquipementCout.message}</FormErrorMessage>}
      </FormControl>
    );
  },
);
