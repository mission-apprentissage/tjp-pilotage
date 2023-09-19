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

import { toBoolean } from "../toBoolean";

export const PoursuitePedagogiqueField = chakra(
  ({ className }: { className?: string }) => {
    const {
      formState: { errors },
      control,
    } = useFormContext<IntentionForms[2]>();

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.poursuitePedagogique}
        isRequired
      >
        <FormLabel>Poursuite pédagogique</FormLabel>
        <Controller
          name="poursuitePedagogique"
          control={control}
          rules={{
            validate: (value) =>
              typeof value === "boolean" || "Le champ est obligatoire",
          }}
          render={({ field: { onChange, value } }) => (
            <RadioGroup
              as={Stack}
              onChange={(v) => onChange(toBoolean(v))}
              value={JSON.stringify(value)}
            >
              <Radio value="true">Oui</Radio>
              <Radio value="false">Non</Radio>
            </RadioGroup>
          )}
        />
        {errors.poursuitePedagogique && (
          <FormErrorMessage>
            {errors.poursuitePedagogique?.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
