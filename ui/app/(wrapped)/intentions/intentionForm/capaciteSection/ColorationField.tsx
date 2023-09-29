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

import { IntentionForms } from "@/app/(wrapped)/intentions/intentionForm/defaultFormValues";

import { toBoolean } from "../../utils/toBoolean";

export const ColorationField = chakra(
  ({ className }: { className?: string }) => {
    const {
      formState: { errors },
      control,
    } = useFormContext<IntentionForms>();

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.coloration}
        isRequired
      >
        <FormLabel>Coloration</FormLabel>
        <Controller
          name="coloration"
          control={control}
          shouldUnregister={true}
          rules={{
            validate: (value) =>
              typeof value === "boolean" || "Le champ est obligatoire",
          }}
          render={({ field: { onChange, ref, name, onBlur, value } }) => (
            <RadioGroup
              as={Stack}
              name={name}
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
        {errors.coloration && (
          <FormErrorMessage>{errors.coloration.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
