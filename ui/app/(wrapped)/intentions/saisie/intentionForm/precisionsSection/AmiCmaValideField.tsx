import { chakra, FormControl, FormErrorMessage, FormLabel, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import type { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";
import { toBoolean } from "@/utils/toBoolean";

export const AmiCmaValideField = chakra(({ disabled, className }: { disabled?: boolean; className?: string }) => {
  const {
    formState: { errors },
    control,
    watch,
    setValue,
    getValues,
  } = useFormContext<IntentionForms>();

  useEffect(
    () =>
      watch((_, { name }) => {
        if (name !== "amiCmaEnCoursValidation") return;
        if (getValues("amiCmaEnCoursValidation") === false) return;
        setValue("amiCmaValide", false);
      }).unsubscribe
  );

  const visible = watch("amiCma");
  if (!visible) return null;

  return (
    <FormControl as="fieldset" className={className} isInvalid={!!errors.amiCmaValide}>
      <FormLabel as="legend">Le financement est-il validé ?</FormLabel>
      <Controller
        name="amiCmaValide"
        control={control}
        rules={{
          validate: (value) => typeof value === "boolean" || "Le champ est obligatoire",
        }}
        render={({ field: { onChange, value, onBlur, ref } }) => (
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
      {errors.amiCmaValide && <FormErrorMessage>{errors.amiCmaValide?.message}</FormErrorMessage>}
    </FormControl>
  );
});
