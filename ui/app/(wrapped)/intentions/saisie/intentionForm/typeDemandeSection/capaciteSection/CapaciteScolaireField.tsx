import {
  chakra,
  FormControl,
  FormErrorMessage,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { isTypeFermeture } from "../../../../utils/typeDemandeUtils";
import { IntentionForms } from "../../defaultFormValues";

export const CapaciteScolaireField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      watch,
      setValue,
      control,
    } = useFormContext<IntentionForms>();

    useEffect(
      () =>
        watch((_, { name }) => {
          if (name !== "typeDemande") return;
          setValue("capaciteScolaire", 0);
        }).unsubscribe
    );

    const typeDemande = watch("typeDemande");
    const fermeture = isTypeFermeture(typeDemande);

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.capaciteScolaire}
        isRequired
      >
        <Controller
          name="capaciteScolaire"
          control={control}
          rules={{
            required: "Le champ est obligatoire",
          }}
          render={({ field: { onChange, value, onBlur, ref, name } }) => {
            return (
              <NumberInput
                step={1}
                flex={1}
                isReadOnly={disabled || fermeture}
                onChange={onChange}
                ref={ref}
                name={name}
                isRequired
                key={value}
                onBlur={onBlur}
                value={value}
                defaultValue={0}
                min={0}
              >
                <NumberInputField
                  textAlign={"end"}
                  fontSize={"16px"}
                  fontWeight={700}
                  borderWidth={"1px"}
                  borderColor={"gray.200"}
                  borderRadius={4}
                  _readOnly={{
                    opacity: "0.5",
                    cursor: "not-allowed",
                  }}
                  py={6}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper
                    opacity={disabled || fermeture ? "0.3" : "1"}
                    cursor={disabled || fermeture ? "not-allowed" : "pointer"}
                  />
                  <NumberDecrementStepper
                    _disabled={{
                      opacity: "0.3",
                      cursor: "not-allowed",
                    }}
                  />
                </NumberInputStepper>
              </NumberInput>
            );
          }}
        />
        {errors.capaciteScolaire && (
          <FormErrorMessage>{errors.capaciteScolaire.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  }
);