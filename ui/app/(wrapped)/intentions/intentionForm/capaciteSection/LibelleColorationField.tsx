import {
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "@/app/(wrapped)/intentions/intentionForm/defaultFormValues";

export const LibelleColorationField = chakra(
  ({ className }: { className?: string }) => {
    const {
      formState: { errors },
      watch,
      register,
    } = useFormContext<IntentionForms[2]>();

    const [coloration] = watch(["coloration"]);

    return (
      <>
        {coloration && (
          <FormControl
            className={className}
            isInvalid={!!errors.libelleColoration}
            isRequired
          >
            <FormLabel>Complément du libéllé formation</FormLabel>
            <Input
              {...register("libelleColoration", {
                shouldUnregister: true,
                required: "Ce champ est obligatoire",
              })}
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
