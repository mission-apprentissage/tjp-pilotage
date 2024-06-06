import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "../../defaultFormValues";

export const LibelleColorationField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      watch,
      register,
    } = useFormContext<IntentionForms>();

    const [coloration] = watch(["coloration"]);

    return (
      <>
        {coloration && (
          <FormControl
            className={className}
            isInvalid={!!errors.libelleColoration}
          >
            <FormLabel>Complément du libellé formation</FormLabel>
            <Input
              {...register("libelleColoration", {
                shouldUnregister: true,
                disabled,
                required: "Ce champ est obligatoire",
              })}
              placeholder="Complément du libellé formation"
            />
            {errors.libelleColoration && (
              <FormErrorMessage>
                {errors.libelleColoration?.message}
              </FormErrorMessage>
            )}
          </FormControl>
        )}
      </>
    );
  }
);
