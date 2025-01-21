import { chakra, FormControl, FormErrorMessage, FormLabel, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";
import { toBoolean } from "@/utils/toBoolean";

export const AugmentationCapaciteAccueilHebergementField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
    } = useFormContext<IntentionForms>();

    return (
      <FormControl as="fieldset" className={className} isInvalid={!!errors.augmentationCapaciteAccueilHebergement} isRequired>
        <FormLabel as="legend">
          Votre proposition est-elle susceptible d'augmenter les capacités d'accueil du service d'hébergement ?
        </FormLabel>
        <Controller
          name="augmentationCapaciteAccueilHebergement"
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
        {errors.augmentationCapaciteAccueilHebergement && (
          <FormErrorMessage>{errors.augmentationCapaciteAccueilHebergement?.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
