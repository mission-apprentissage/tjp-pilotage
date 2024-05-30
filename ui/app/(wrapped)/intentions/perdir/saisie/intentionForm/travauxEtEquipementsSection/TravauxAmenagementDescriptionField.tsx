import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "../defaultFormValues";

export const TravauxAmenagementDescriptionField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
    } = useFormContext<IntentionForms>();

    const visible = watch("travauxAmenagement");
    if (!visible) return null;

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.travauxAmenagementDescription}
      >
        <FormLabel>Pouvez-vous décrire les travaux ?</FormLabel>
        <Textarea
          variant="grey"
          height={50}
          {...register("travauxAmenagementDescription", {
            shouldUnregister: true,
            disabled,
          })}
        />
        {errors.travauxAmenagementDescription && (
          <FormErrorMessage>
            {errors.travauxAmenagementDescription.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
