import { chakra, FormControl, FormErrorMessage, FormLabel, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import type { CampagneType } from "shared/schema/campagneSchema";

import type { CorrectionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/correctionSection/defaultFormValues";
import {getRaisonCorrectionOptionsParAnneeCampagne} from '@/app/(wrapped)/intentions/utils/raisonCorrectionUtils';



export const RaisonField = chakra(
  ({ campagne, disabled, className }: { campagne: CampagneType; disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
    } = useFormContext<CorrectionForms>();

    return (
      <FormControl className={className} isInvalid={!!errors.raison} isRequired>
        <FormLabel>Merci de préciser la raison de votre correction</FormLabel>
        <Controller
          name="raison"
          control={control}
          disabled={disabled}
          rules={{ required: "Le raison est obligatoire" }}
          render={({ field: { onChange, value, onBlur, ref, name } }) => {
            return (
              <RadioGroup onChange={onChange} value={value} isDisabled={disabled}>
                <Stack spacing={[3]} ms={6}>
                  {getRaisonCorrectionOptionsParAnneeCampagne(campagne.annee)?.map(({ value, label }) => (
                    <Radio
                      ref={ref}
                      name={name}
                      key={`${name}_${label}`}
                      onBlur={onBlur}
                      value={value}
                      isReadOnly={disabled}
                      _readOnly={{ cursor: "not-allowed", opacity: 0.5 }}
                    >
                      <Text fontWeight={"normal !important"}>{label}</Text>
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            );
          }}
        />
        {errors.raison && <FormErrorMessage>{errors.raison.message}</FormErrorMessage>}
      </FormControl>
    );
  }
);
