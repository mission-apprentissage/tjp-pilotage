import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import {
  RaisonCorrectionCampagne,
  RAISONS_CORRECTION_LABELS,
} from "../../../../utils/raisonCorrectionUtils";
import { CorrectionForms } from "../defaultFormValues";
import { Campagne } from "../types";

const getRaisonCorrectionOptions = (
  campagne: string = CURRENT_ANNEE_CAMPAGNE
) => {
  return Object.entries(
    RAISONS_CORRECTION_LABELS[campagne as RaisonCorrectionCampagne]
  ).map(([value, label]) => ({
    value,
    label,
  }));
};

export const RaisonField = chakra(
  ({ campagne, className }: { campagne?: Campagne; className?: string }) => {
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
          rules={{ required: "Le raison est obligatoire" }}
          render={({ field: { onChange, value, onBlur, ref, name } }) => {
            return (
              <RadioGroup onChange={onChange} value={value}>
                <Stack spacing={[3]} ms={6}>
                  {getRaisonCorrectionOptions(campagne?.annee)?.map(
                    ({ value, label }) => (
                      <Radio
                        ref={ref}
                        name={name}
                        key={`${name}_${label}`}
                        onBlur={onBlur}
                        value={value}
                      >
                        <Text fontWeight={"normal !important"}>{label}</Text>
                      </Radio>
                    )
                  )}
                </Stack>
              </RadioGroup>
            );
          }}
        />
        {errors.raison && (
          <FormErrorMessage>{errors.raison.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
