import { chakra, FormControl, FormErrorMessage, FormLabel, Textarea } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";

export const AugmentationCapaciteAccueilHebergementPrecisionsField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
      setValue,
    } = useFormContext<DemandeFormType>();

    const visible = watch("augmentationCapaciteAccueilHebergement");

    useEffect(() => {
      if (!visible) {
        setValue("augmentationCapaciteAccueilHebergementPrecisions", undefined);
      }
    }, [visible, setValue]);

    if (!visible) return null;

    return (
      <FormControl className={className} isInvalid={!!errors.augmentationCapaciteAccueilHebergementPrecisions}>
        <FormLabel>Précisions ?</FormLabel>
        <Textarea
          variant="grey"
          height={50}
          {...register("augmentationCapaciteAccueilHebergementPrecisions", {
            disabled,
          })}
        />
        {errors.augmentationCapaciteAccueilHebergementPrecisions && (
          <FormErrorMessage>{errors.augmentationCapaciteAccueilHebergementPrecisions.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
