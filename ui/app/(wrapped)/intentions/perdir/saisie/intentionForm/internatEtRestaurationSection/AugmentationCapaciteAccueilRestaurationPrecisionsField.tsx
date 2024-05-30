import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "../defaultFormValues";

export const AugmentationCapaciteAccueilRestaurationPrecisionsField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
    } = useFormContext<IntentionForms>();

    const visible = watch("augmentationCapaciteAccueilRestauration");

    if (!visible) return null;

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.augmentationCapaciteAccueilRestaurationPrecisions}
      >
        <FormLabel>Précisions ?</FormLabel>
        <Textarea
          variant="grey"
          height={50}
          {...register("augmentationCapaciteAccueilRestaurationPrecisions", {
            shouldUnregister: true,
            disabled,
          })}
        />
        {errors.augmentationCapaciteAccueilRestaurationPrecisions && (
          <FormErrorMessage>
            {errors.augmentationCapaciteAccueilRestaurationPrecisions.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
