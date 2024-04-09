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

import { isTypeOuverture } from "../../../../utils/typeDemandeUtils";
import { IntentionForms } from "../../defaultFormValues";

export const CapaciteScolaireActuelleField = chakra(
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
          setValue("capaciteScolaireActuelle", 0);
        }).unsubscribe
    );

    const typeDemande = watch("typeDemande");
    const ouverture = isTypeOuverture(typeDemande);

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.capaciteScolaireActuelle}
        isRequired
      >
        <Controller
          name="capaciteScolaireActuelle"
          shouldUnregister
          control={control}
          rules={{
            required: "Le champ est obligatoire",
          }}
          render={({ field: { onChange, value, onBlur, ref, name } }) => (
            <NumberInput
              step={1}
              flex={1}
              isReadOnly={disabled || ouverture}
              onChange={onChange}
              ref={ref}
              name={name}
              isRequired={false}
              key={value}
              onBlur={onBlur}
              value={value}
              min={0}
              defaultValue={0}
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
                  opacity={disabled || ouverture ? "0.3" : "1"}
                  cursor={disabled || ouverture ? "not-allowed" : "pointer"}
                />
                <NumberDecrementStepper
                  opacity={disabled || ouverture ? "0.3" : "1"}
                  cursor={disabled || ouverture ? "not-allowed" : "pointer"}
                  _disabled={{
                    opacity: "0.3",
                    cursor: "not-allowed",
                  }}
                />
              </NumberInputStepper>
            </NumberInput>
          )}
        />
        {errors.capaciteScolaireActuelle && (
          <FormErrorMessage>
            {errors.capaciteScolaireActuelle.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
