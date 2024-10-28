import { chakra, Flex, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";

export const NomCmqField = chakra(({ disabled, className }: { disabled?: boolean; className?: string }) => {
  const {
    formState: { errors },
    watch,
    register,
  } = useFormContext<IntentionForms>();

  const visible = watch("cmqImplique");
  if (!visible) return null;

  return (
    <Flex flex={1}>
      <FormControl className={className} isInvalid={!!errors.nomCmq}>
        <FormLabel>Précisez le campus</FormLabel>
        <Input
          w="xs"
          bgColor={"white"}
          {...register("nomCmq", {
            disabled: disabled,
            required: "Veuillez préciser le nom du campus",
          })}
        />
        {errors.nomCmq && <FormErrorMessage>{errors.nomCmq.message}</FormErrorMessage>}
      </FormControl>
    </Flex>
  );
});
