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
import { Controller, useFormContext } from "react-hook-form";

import { IntentionForms } from "../../defaultFormValues";

export const NbProfesseurAssocieRHField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
      watch,
    } = useFormContext<IntentionForms>();

    const visible = watch("professeurAssocieRH");

    return (
      visible && (
        <FormControl
          className={className}
          isInvalid={!!errors.nbProfesseurAssocieRH}
        >
          <FormLabel>Combien de professeurs associés ?</FormLabel>
          <Controller
            name="nbProfesseurAssocieRH"
            shouldUnregister
            control={control}
            rules={{
              required: "Le champ est obligatoire",
            }}
            render={({ field: { onChange, value, onBlur, ref, name } }) => (
              <NumberInput
                step={1}
                flex={1}
                isReadOnly={disabled}
                onChange={onChange}
                ref={ref}
                name={name}
                isRequired={false}
                key={value}
                onBlur={onBlur}
                value={value}
                min={0}
                defaultValue={0}
                size={"md"}
                w={56}
                bgColor={"white"}
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
          {errors.nbProfesseurAssocieRH && (
            <FormErrorMessage>
              {errors.nbProfesseurAssocieRH.message}
            </FormErrorMessage>
          )}
        </FormControl>
      )
    );
  }
);
