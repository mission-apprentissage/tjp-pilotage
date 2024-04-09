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

export const AutreBesoinRHField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
    const {
      formState: { errors },
      register,
      watch,
    } = useFormContext<IntentionForms>();

    const [besoinRH] = watch(["besoinRH"]);

    const visible = besoinRH?.includes("autre");

    return (
      <Collapse in={visible} unmountOnExit>
        <FormControl className={className} isInvalid={!!errors.autreBesoinRH}>
          <FormLabel>Autre besoin RH</FormLabel>
          {visible && (
            <Textarea
              {...register("autreBesoinRH", {
                shouldUnregister: true,
                disabled,
                required: "Veuillez préciser votre besoin RH",
              })}
            />
          )}
          {errors.autreBesoinRH && (
            <FormErrorMessage>{errors.autreBesoinRH.message}</FormErrorMessage>
          )}
        </FormControl>
      </Collapse>
    );
  }
);
