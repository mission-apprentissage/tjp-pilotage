import { chakra, FormControl, FormErrorMessage, FormLabel, Textarea } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";

export const TravauxAmenagementDescriptionField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
      setValue,
    } = useFormContext<IntentionForms>();

    const visible = watch("travauxAmenagement");

    useEffect(() => {
      if (!visible) {
        setValue("travauxAmenagementDescription", undefined);
      }
    }, [visible, setValue]);

    if (!visible) return null;

    return (
      <FormControl className={className} isInvalid={!!errors.travauxAmenagementDescription}>
        <FormLabel>Pouvez-vous décrire les travaux ?</FormLabel>
        <Textarea
          variant="grey"
          height={50}
          {...register("travauxAmenagementDescription", {
            disabled,
          })}
        />
        {errors.travauxAmenagementDescription && (
          <FormErrorMessage>{errors.travauxAmenagementDescription.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  },
);
