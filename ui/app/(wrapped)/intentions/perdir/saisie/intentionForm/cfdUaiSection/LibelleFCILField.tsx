import {
  Box,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  LightMode,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { IntentionForms } from "../defaultFormValues";

export const LibelleFCILField = chakra(
  ({
    className,
    active,
    isFCIL,
  }: {
    className?: string;
    active: boolean;
    isFCIL: boolean;
  }) => {
    const {
      formState: { errors },
      register,
      setValue,
    } = useFormContext<IntentionForms>();

    useEffect(() => {
      if (!isFCIL) {
        setValue("libelleFCIL", undefined);
      }
    }, [isFCIL, setValue]);

    if (!isFCIL) return null;

    return (
      <LightMode>
        <FormControl
          mb="4"
          className={className}
          isInvalid={!!errors.libelleFCIL}
          isRequired
          isDisabled={!active}
        >
          <FormLabel>Libellé du FCIL</FormLabel>
          <Flex flexDirection={"row"} justifyContent={"space-between"}>
            <Box color="chakra-body-text" w="100%" maxW="752px">
              <Input
                bgColor={"white"}
                color="black"
                {...register("libelleFCIL", {
                  required: "Ce champ est obligatoire",
                })}
                placeholder="Libellé FCIL"
                disabled={!active}
              />
            </Box>
          </Flex>
          {errors.libelleFCIL && (
            <FormErrorMessage>{errors.libelleFCIL?.message}</FormErrorMessage>
          )}
        </FormControl>
      </LightMode>
    );
  }
);
