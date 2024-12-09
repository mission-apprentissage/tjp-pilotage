import { Box, chakra, Flex, FormControl, FormErrorMessage, FormLabel, Input, LightMode } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import type { IntentionForms } from "@/app/(wrapped)/intentions/saisie/intentionForm/defaultFormValues";

export const LibelleFCILField = chakra(({ className, active }: { className?: string; active: boolean }) => {
  const {
    formState: { errors },
    register,
  } = useFormContext<IntentionForms>();

  return (
    <LightMode>
      <FormControl mb="4" className={className} isInvalid={!!errors.libelleFCIL} isRequired>
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
        {errors.libelleFCIL && <FormErrorMessage>{errors.libelleFCIL?.message}</FormErrorMessage>}
      </FormControl>
    </LightMode>
  );
});
