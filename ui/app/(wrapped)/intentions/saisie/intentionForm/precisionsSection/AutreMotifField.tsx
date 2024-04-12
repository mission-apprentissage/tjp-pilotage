import {
  chakra,
  Collapse,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";

export const AutreMotifField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
    } = useFormContext<IntentionForms>();

    const [motif] = watch(["motif"]);

    const visible =
      motif?.includes("autre") || motif?.includes("mise_en_place_partenariat");

    return (
      <Collapse in={visible} unmountOnExit>
        <FormControl
          className={className}
          isInvalid={!!errors.autreMotif}
          isRequired
        >
          <FormLabel>Autre motif ou précision</FormLabel>
          {visible && (
            <Textarea
              {...register("autreMotif", {
                shouldUnregister: true,
                disabled,
                required: "Veuillez préciser votre motif",
              })}
            />
          )}
          {errors.autreMotif && (
            <FormErrorMessage>{errors.autreMotif.message}</FormErrorMessage>
          )}
        </FormControl>
      </Collapse>
    );
  }
);
