import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import { toBoolean } from "@/utils/toBoolean";

import { IntentionForms } from "../defaultFormValues";

export const AugmentationCapaciteAccueilRestaurationField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
    } = useFormContext<IntentionForms>();

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.augmentationCapaciteAccueilRestauration}
        isRequired
      >
        <FormLabel>
          Votre proposition est-elle susceptible d'augmenter les capacités
          d'accueil du service de restauration ?
        </FormLabel>
        <Controller
          name="augmentationCapaciteAccueilRestauration"
          control={control}
          disabled={disabled}
          rules={{
            validate: (value) =>
              typeof value === "boolean" || "Le champ est obligatoire",
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
        {errors.augmentationCapaciteAccueilRestauration && (
          <FormErrorMessage>
            {errors.augmentationCapaciteAccueilRestauration?.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
