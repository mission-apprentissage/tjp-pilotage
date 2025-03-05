import { chakra, FormControl, FormErrorMessage, FormLabel, Select } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import type { CampagneType } from "shared/schema/campagneSchema";

import type { CorrectionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/correctionSection/defaultFormValues";
import type {AnneeCampagneMotifCorrection} from '@/app/(wrapped)/intentions/utils/motifCorrectionUtils';
import { getMotifCorrectionOptionsParAnneeCampagne} from '@/app/(wrapped)/intentions/utils/motifCorrectionUtils';


export const MotifField = chakra(
  ({ campagne, disabled = false, className }: { campagne: CampagneType; disabled?: boolean; className?: string }) => {
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
                {
                  getMotifCorrectionOptionsParAnneeCampagne(campagne.annee as AnneeCampagneMotifCorrection).map(
                    (motif) => (
                      <option key={motif.value} value={motif.value}>
                        {motif.label}
                      </option>
                    ))
                }
              </Select>
            );
          }}
        />
        {errors.motif && <FormErrorMessage>{errors.motif.message}</FormErrorMessage>}
      </FormControl>
    );
  }
);
