import { chakra, FormControl, FormErrorMessage, FormLabel, Select } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import type { CorrectionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/correctionSection/defaultFormValues";
import type { Campagne } from "@/app/(wrapped)/intentions/saisie/intentionForm/correctionSection/types";
import type { MotifCorrectionCampagne } from "@/app/(wrapped)/intentions/utils/motifCorrectionUtils";
import { MOTIFS_CORRECTION_LABELS } from "@/app/(wrapped)/intentions/utils/motifCorrectionUtils";

const getMotifCorrectionOptions = (campagne: string = CURRENT_ANNEE_CAMPAGNE) => {
  return Object.entries(MOTIFS_CORRECTION_LABELS[campagne as MotifCorrectionCampagne]).map(([value, label]) => ({
    value,
    label,
  }));
};

export const MotifField = chakra(
  ({ campagne, disabled = false, className }: { campagne?: Campagne; disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      control,
    } = useFormContext<CorrectionForms>();

    return (
      <FormControl className={className} isInvalid={!!errors.motif} isRequired>
        <FormLabel>Merci de préciser le(s) motif(s) de votre correction</FormLabel>
        <Controller
          name="motif"
          control={control}
          rules={{ required: "Le motif est obligatoire" }}
          disabled={disabled}
          render={({ field: { onChange, value, onBlur, ref, name } }) => {
            return (
              <Select
                name={name}
                isRequired={true}
                mb={4}
                onChange={onChange}
                value={value}
                onBlur={onBlur}
                ref={ref}
                placeholder="Sélectionner un motif de correction"
                disabled={disabled}
              >
                {getMotifCorrectionOptions(campagne?.annee).map((motif) => (
                  <option key={motif.value} value={motif.value}>
                    {motif.label}
                  </option>
                ))}
              </Select>
            );
          }}
        />
        {errors.motif && <FormErrorMessage>{errors.motif.message}</FormErrorMessage>}
      </FormControl>
    );
  },
);
