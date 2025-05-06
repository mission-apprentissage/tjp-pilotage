import { chakra, FormControl, FormErrorMessage, FormLabel, Textarea } from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import type { DemandeFormType } from "@/app/(wrapped)/demandes/saisie/demandeForm/types";

export const AchatEquipementDescriptionField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
      setValue,
    } = useFormContext<DemandeFormType>();

    const visible = watch("achatEquipement");

    useEffect(() => {
      if (!visible) {
        setValue("achatEquipementDescription", undefined);
      }
    }, [visible, setValue]);

    if (!visible) return null;

    return (
      <FormControl className={className} isInvalid={!!errors.achatEquipementDescription}>
        <FormLabel>Pouvez-vous précisez le(s)quel(s) ?</FormLabel>
        <Textarea
          variant="grey"
          height={50}
          {...register("achatEquipementDescription", {
            disabled,
          })}
        />
        {errors.achatEquipementDescription && (
          <FormErrorMessage>{errors.achatEquipementDescription.message}</FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
