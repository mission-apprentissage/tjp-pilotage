import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "../defaultFormValues";

export const AchatEquipementDescriptionField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
    } = useFormContext<IntentionForms>();

    const visible = watch("achatEquipement");
    if (!visible) return null;

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.achatEquipementDescription}
      >
        <FormLabel>Pouvez-vous précisez le(s)quel(s) ?</FormLabel>
        <Textarea
          variant="grey"
          height={50}
          {...register("achatEquipementDescription", {
            shouldUnregister: true,
            disabled,
          })}
        />
        {errors.achatEquipementDescription && (
          <FormErrorMessage>
            {errors.achatEquipementDescription.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
