import { chakra, FormControl, FormErrorMessage, FormLabel, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import type { CorrectionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/correctionSection/defaultFormValues";
import type { Campagne } from "@/app/(wrapped)/intentions/saisie/intentionForm/correctionSection/types";
import type { RaisonCorrectionCampagne } from "@/app/(wrapped)/intentions/utils/raisonCorrectionUtils";
import { RAISONS_CORRECTION_LABELS } from "@/app/(wrapped)/intentions/utils/raisonCorrectionUtils";

const getRaisonCorrectionOptions = (campagne: string = CURRENT_ANNEE_CAMPAGNE) => {
  return Object.entries(RAISONS_CORRECTION_LABELS[campagne as RaisonCorrectionCampagne]).map(([value, label]) => ({
    value,
    label,
  }));
};

export const RaisonField = chakra(
  ({ campagne, disabled, className }: { campagne?: Campagne; disabled?: boolean; className?: string }) => {
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
                  {getRaisonCorrectionOptions(campagne?.annee)?.map(({ value, label }) => (
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
  },
);
