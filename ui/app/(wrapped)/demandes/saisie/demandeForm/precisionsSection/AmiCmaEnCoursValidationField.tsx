import { chakra, FormControl, FormErrorMessage, FormLabel, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { isTypeDiminution,isTypeFermeture } from "shared/utils/typeDemandeUtils";

import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";
import { toBoolean } from "@/utils/toBoolean";

export const AmiCmaEnCoursValidationField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
      watch,
      getValues,
      setValue,
    } = useFormContext<DemandeFormType>();

    useEffect(
      () =>
        watch((_, { name }) => {
          if (name !== "amiCmaValide" && name !== "amiCma") return;
          if (name === "amiCma") setValue("amiCmaEnCoursValidation", undefined);
          if (name === "amiCmaValide" && getValues("amiCmaValide") === true) setValue("amiCmaEnCoursValidation", false);
        }).unsubscribe
    );

    const [typeDemande, amiCma] = watch(["typeDemande", "amiCma"]);
    const visible = !isTypeFermeture(typeDemande) && !isTypeDiminution(typeDemande) && amiCma;
    if (!visible) return null;

    return (
      <FormControl as="fieldset" className={className} isInvalid={!!errors.amiCmaEnCoursValidation}>
        <FormLabel as="legend">Demande en cours ?</FormLabel>
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
