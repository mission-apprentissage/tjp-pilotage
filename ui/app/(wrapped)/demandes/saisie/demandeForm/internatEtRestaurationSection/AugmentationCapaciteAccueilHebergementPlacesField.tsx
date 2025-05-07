import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";

export const AugmentationCapaciteAccueilHebergementPlacesField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
      watch,
      setValue,
    } = useFormContext<DemandeFormType>();

    const visible = watch("augmentationCapaciteAccueilHebergement");

    useEffect(() => {
      if (!visible) {
        setValue("augmentationCapaciteAccueilHebergementPlaces", undefined);
      }
    }, [visible, setValue]);

    if (!visible) return null;

    return (
      <FormControl className={className} isInvalid={!!errors.augmentationCapaciteAccueilHebergementPlaces}>
        <FormLabel>Combien de places ?</FormLabel>
        <Controller
          name="augmentationCapaciteAccueilHebergementPlaces"
          control={control}
          rules={{
            required: "Le champ est obligatoire",
          }}
          render={({ field: { onChange, value, onBlur, ref, name } }) => (
            <NumberInput
              flex={1}
              isReadOnly={disabled}
              onChange={(value) => onChange(value.replace(/\D/g, ""))}
              ref={ref}
              name={name}
              isRequired={false}
              key={name}
              onBlur={onBlur}
              value={value}
              min={0}
              defaultValue={0}
              size={"md"}
              w={56}
              bgColor={"white"}
              focusInputOnChange={false}
              onFocus={(e) => e.currentTarget.select()}
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
              />
              <NumberInputStepper>
                <NumberIncrementStepper
                  opacity={disabled ? "0.3" : "1"}
                  cursor={disabled ? "not-allowed" : "pointer"}
                />
                <NumberDecrementStepper
                  opacity={disabled ? "0.3" : "1"}
                  cursor={disabled ? "not-allowed" : "pointer"}
                  _disabled={{
                    opacity: "0.3",
                    cursor: "not-allowed",
                  }}
                />
              </NumberInputStepper>
            </NumberInput>
          )}
        />
        {errors.augmentationCapaciteAccueilHebergementPlaces && (
          <FormErrorMessage>{errors.augmentationCapaciteAccueilHebergementPlaces.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
