import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { isTypeColoration } from "../../../../utils/typeDemandeUtils";
import { toBoolean } from "../../../utils/toBoolean";
import { IntentionForms } from "../../defaultFormValues";

export const ColorationField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
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
          if (name !== "typeDemande") return;
          if (isTypeColoration(getValues("typeDemande")))
            setValue("coloration", true);
        }).unsubscribe
    );

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
          disabled={disabled}
          rules={{
            validate: (value) =>
              typeof value === "boolean" || "Le champ est obligatoire",
          }}
          render={({
            field: { onChange, ref, name, onBlur, value, disabled },
          }) => (
            <RadioGroup
              ms={6}
              as={Stack}
              name={name}
              onBlur={onBlur}
              onChange={(v) => onChange(toBoolean(v))}
              value={JSON.stringify(value)}
              isDisabled={disabled}
            >
              <Radio
                ref={ref}
                value="true"
                isReadOnly={isTypeColoration(getValues("typeDemande"))}
                _readOnly={{ cursor: "not-allowed", opacity: 0.5 }}
              >
                Oui
              </Radio>
              <Radio
                ref={ref}
                value="false"
                isReadOnly={isTypeColoration(getValues("typeDemande"))}
                _readOnly={{ cursor: "not-allowed", opacity: 0.5 }}
              >
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
