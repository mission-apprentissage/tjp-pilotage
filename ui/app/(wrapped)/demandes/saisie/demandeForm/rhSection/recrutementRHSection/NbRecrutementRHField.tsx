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
import { Controller, useFormContext } from "react-hook-form";

import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";

export const NbRecrutementRHField = chakra(({ disabled, className }: { disabled?: boolean; className?: string }) => {
  const {
    formState: { errors },
    control,
    watch,
  } = useFormContext<DemandeFormType>();

  const visible = watch("recrutementRH");
  if (!visible) return null;

  return (
    <FormControl className={className} isInvalid={!!errors.nbRecrutementRH}>
      <FormLabel>Combien de recrutements ?</FormLabel>
      <Controller
        name="nbRecrutementRH"
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
              <NumberIncrementStepper opacity={disabled ? "0.3" : "1"} cursor={disabled ? "not-allowed" : "pointer"} />
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
      {errors.nbRecrutementRH && <FormErrorMessage>{errors.nbRecrutementRH.message}</FormErrorMessage>}
      <FormHelperText>
        Si le besoin en recrutement est inférieur à 1 ETP veuillez saisir 1, et préciser la quotité (0.2 ETP par ex)
        dans le champ "commentaires/observations"
      </FormHelperText>
    </FormControl>
  );
});
