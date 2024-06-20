import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "../defaultFormValues";

export const InspecteurReferentField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      register,
    } = useFormContext<IntentionForms>();

    return (
      <FormControl
        className={className}
        isInvalid={!!errors.inspecteurReferent}
      >
        <FormLabel>Inspecteur disciplinaire concerné</FormLabel>
        <Input
          w="xs"
          bgColor={"white"}
          {...register("inspecteurReferent", {
            shouldUnregister: true,
            disabled: disabled,
          })}
        />
        {errors.inspecteurReferent && (
          <FormErrorMessage>
            {errors.inspecteurReferent.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }
);
