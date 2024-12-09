import { chakra, FormControl, FormErrorMessage, FormLabel, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import type { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";
import { toBoolean } from "@/utils/toBoolean";

export const AmiCmaEnCoursValidationField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
      watch,
      getValues,
      setValue,
    } = useFormContext<IntentionForms>();

    useEffect(
      () =>
        watch((_, { name }) => {
          if (name !== "amiCmaValide") return;
          if (getValues("amiCmaValide") === false) return;
          setValue("amiCmaEnCoursValidation", false);
        }).unsubscribe
    );

    const visible = watch("amiCma");
    if (!visible) return null;

    return (
      <FormControl className={className} isInvalid={!!errors.amiCmaEnCoursValidation}>
        <FormLabel>Demande en cours ?</FormLabel>
        <Controller
          name="amiCmaEnCoursValidation"
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
        {errors.amiCmaEnCoursValidation && (
          <FormErrorMessage>{errors.amiCmaEnCoursValidation?.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
