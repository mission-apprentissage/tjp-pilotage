import {
  chakra,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Stack,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import {
  MotifCorrectionCampagne,
  MOTIFS_CORRECTION_LABELS,
} from "../../../../utils/motifCorrectionUtils";
import { CorrectionForms } from "../defaultFormValues";
import { Campagne } from "../types";

const getMotifCorrectionOptions = (
  campagne: string = CURRENT_ANNEE_CAMPAGNE
) => {
  return Object.entries(
    MOTIFS_CORRECTION_LABELS[campagne as MotifCorrectionCampagne]
  ).map(([value, label]) => ({
    value,
    label,
  }));
};

export const MotifField = chakra(
  ({ campagne, className }: { campagne?: Campagne; className?: string }) => {
    const {
      formState: { errors },
      control,
    } = useFormContext<CorrectionForms>();

    return (
      <FormControl className={className} isInvalid={!!errors.motif} isRequired>
        <FormLabel>
          Merci de préciser le(s) motif(s) de votre correction
        </FormLabel>
        <Controller
          name="motif"
          control={control}
          rules={{ required: "Le motif est obligatoire" }}
          render={({ field: { onChange, value, onBlur, ref, name } }) => {
            return (
              <CheckboxGroup onChange={onChange} value={value}>
                <Stack spacing={[3]} ms={6}>
                  {getMotifCorrectionOptions(campagne?.annee)?.map(
                    ({ value, label }) => (
                      <Checkbox
                        ref={ref}
                        name={name}
                        key={`${name}_${label}`}
                        onBlur={onBlur}
                        value={value}
                        _checked={{ fontWeight: "bold !important" }}
                        fontWeight={"400 !important"}
                      >
                        {label}
                      </Checkbox>
                    )
                  )}
                </Stack>
              </CheckboxGroup>
            );
          }}
        />
      </FormControl>
    );
  }
);
