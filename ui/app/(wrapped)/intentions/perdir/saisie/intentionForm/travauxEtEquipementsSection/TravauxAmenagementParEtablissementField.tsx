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

import { toBoolean } from "../../utils/toBoolean";
import { IntentionForms } from "../defaultFormValues";

export const TravauxAmenagementParEtablissementField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
      watch,
    } = useFormContext<IntentionForms>();

    const visible = watch("travauxAmenagement");
    if (!visible) return null;

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.travauxAmenagementParEtablissement}
        isRequired
      >
        <FormLabel>
          Les travaux peuvent-ils être réalisés par l'établissement (sans
          sollicitation de la Région) ?
        </FormLabel>
        <Controller
          name="travauxAmenagementParEtablissement"
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
        {errors.travauxAmenagementParEtablissement && (
          <FormErrorMessage>
            {errors.travauxAmenagementParEtablissement?.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
