import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "../defaultFormValues";

export const AugmentationCapaciteAccueilHebergementPrecisionsField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
    } = useFormContext<IntentionForms>();

    const visible = watch("augmentationCapaciteAccueilHebergement");
    if (!visible) return null;

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.augmentationCapaciteAccueilHebergementPrecisions}
      >
        <FormLabel>Précisions ?</FormLabel>
        <Textarea
          variant="grey"
          height={50}
          {...register("augmentationCapaciteAccueilHebergementPrecisions", {
            shouldUnregister: true,
            disabled,
          })}
        />
        {errors.augmentationCapaciteAccueilHebergementPrecisions && (
          <FormErrorMessage>
            {errors.augmentationCapaciteAccueilHebergementPrecisions.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
