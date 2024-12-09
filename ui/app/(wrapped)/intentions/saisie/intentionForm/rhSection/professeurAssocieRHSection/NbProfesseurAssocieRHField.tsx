import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import type { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";

export const NbProfesseurAssocieRHField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
      watch,
      setValue,
    } = useFormContext<IntentionForms>();

    const visible = watch("professeurAssocieRH");

    useEffect(() => {
      if (!visible) {
        setValue("nbProfesseurAssocieRH", undefined);
      }
    }, [visible, setValue]);

    if (!visible) return null;

    return (
      <FormControl className={className} isInvalid={!!errors.nbProfesseurAssocieRH}>
        <FormLabel>Combien de professeurs associés ?</FormLabel>
        <Controller
          name="nbProfesseurAssocieRH"
          control={control}
          rules={{
            required: "Le champ est obligatoire",
          }}
          render={({ field: { onChange, value, onBlur, ref, name } }) => (
            <NumberInput
              step={1}
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
        {errors.nbProfesseurAssocieRH && <FormErrorMessage>{errors.nbProfesseurAssocieRH.message}</FormErrorMessage>}
        <FormHelperText>
          Si le besoin en recrutement est inférieur à 1 ETP veuillez saisir 1, et préciser la quotité (0.2 ETP par ex)
          dans le champ "commentaires/observations"
        </FormHelperText>
      </FormControl>
    );
  }
);
