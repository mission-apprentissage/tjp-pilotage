import { chakra, FormControl, FormErrorMessage, FormLabel, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";
import { toBoolean } from "@/utils/toBoolean";

export const FormationRHField = chakra(({ disabled, className }: { disabled?: boolean; className?: string }) => {
  const {
    formState: { errors },
    control,
  } = useFormContext<DemandeFormType>();

  return (
    <FormControl as="fieldset" className={className} isInvalid={!!errors.formationRH} isRequired>
      <FormLabel as="legend">Des formations ?</FormLabel>
      <Controller
        name="formationRH"
        control={control}
        disabled={disabled}
        rules={{
          validate: (value) => typeof value === "boolean" || "Le champ est obligatoire",
        }}
        render={({ field: { onChange, value, onBlur, ref, disabled } }) => (
          <RadioGroup
            ms={6}
            isDisabled={disabled}
            as={Stack}
            onBlur={onBlur}
            onChange={(v) => onChange(toBoolean(v))}
            value={JSON.stringify(value)}
          >
            <Radio ref={ref} value="true">
              Oui
            </Radio>
            <Radio ref={ref} value="false">
              Non
            </Radio>
          </RadioGroup>
        )}
      />
      {errors.formationRH && <FormErrorMessage>{errors.formationRH?.message}</FormErrorMessage>}
    </FormControl>
  );
});
