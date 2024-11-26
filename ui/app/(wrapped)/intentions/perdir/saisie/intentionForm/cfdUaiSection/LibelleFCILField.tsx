import { Box, chakra, Flex, FormControl, FormErrorMessage, FormLabel, Input, LightMode } from "@chakra-ui/react";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import type { IntentionForms } from "@/app/(wrapped)/intentions/perdir/saisie/intentionForm/defaultFormValues";

export const LibelleFCILField = chakra(
  ({ className, disabled, shouldDisplay }: { className?: string; disabled: boolean; shouldDisplay?: boolean }) => {
    const {
      control,
      formState: { errors },
      watch,
      setValue,
    } = useFormContext<IntentionForms>();

    useEffect(
      () =>
        watch((_, { name }) => {
          if (name !== "cfd") return;
          setValue("libelleFCIL", "");
        }).unsubscribe
    );

    if (!shouldDisplay) return <></>;

    return (
      <LightMode>
        <FormControl mb="4" className={className} isInvalid={!!errors.libelleFCIL} isRequired>
          <FormLabel>Libellé du FCIL</FormLabel>
          <Flex flexDirection={"row"} justifyContent={"space-between"}>
            <Box color="chakra-body-text" w="100%" maxW="752px">
              <Controller
                name={"libelleFCIL"}
                control={control}
                rules={{ required: "Ce champ est obligatoire" }}
                render={({ field: { onChange, value, name } }) => (
                  <Input
                    bgColor={"white"}
                    color="black"
                    value={value}
                    name={name}
                    onChange={onChange}
                    placeholder="Libellé FCIL"
                    isDisabled={disabled}
                  />
                )}
              />
            </Box>
          </Flex>
          {errors.libelleFCIL && <FormErrorMessage>{errors.libelleFCIL?.message}</FormErrorMessage>}
        </FormControl>
      </LightMode>
    );
  }
);
