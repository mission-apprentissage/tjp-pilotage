import { chakra, FormControl, FormErrorMessage, FormLabel, Textarea } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";

export const AugmentationCapaciteAccueilRestaurationPrecisionsField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
      setValue,
    } = useFormContext<IntentionForms>();

    const visible = watch("augmentationCapaciteAccueilRestauration");

    useEffect(() => {
      if (!visible) {
        setValue("augmentationCapaciteAccueilRestaurationPrecisions", undefined);
      }
    }, [visible, setValue]);

    if (!visible) return null;

    return (
      <FormControl className={className} isInvalid={!!errors.augmentationCapaciteAccueilRestaurationPrecisions}>
        <FormLabel>Précisions ?</FormLabel>
        <Textarea
          variant="grey"
          height={50}
          {...register("augmentationCapaciteAccueilRestaurationPrecisions", {
            disabled,
          })}
        />
        {errors.augmentationCapaciteAccueilRestaurationPrecisions && (
          <FormErrorMessage>{errors.augmentationCapaciteAccueilRestaurationPrecisions.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  },
);
