import {
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "../defaultFormValues";

export const NomCmqField = chakra(
  ({ disabled, className }: { disabled?: boolean; className?: string }) => {
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
          <Flex direction={"column"}>
            <FormLabel>Précisez le campus</FormLabel>
            <Input
              w="xs"
              bgColor={"white"}
              border={"1px solid"}
              required
              {...register("nomCmq", {
                shouldUnregister: true,
                disabled: disabled,
              })}
            />
          </Flex>
          {errors.nomCmq && (
            <FormErrorMessage>{errors.nomCmq.message}</FormErrorMessage>
          )}
        </FormControl>
      </Flex>
    );
  }
);
