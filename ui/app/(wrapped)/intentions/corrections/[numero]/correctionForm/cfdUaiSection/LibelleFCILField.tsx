import {
  Box,
  chakra,
  Flex,
  FormControl,
  FormLabel,
  Input,
  LightMode,
} from "@chakra-ui/react";

export const LibelleFCILField = chakra(
  ({ className }: { className?: string }) => {
    return (
      <LightMode>
        <FormControl mb="4" className={className} isRequired>
          <FormLabel>Libellé du FCIL</FormLabel>
          <Flex flexDirection={"row"} justifyContent={"space-between"}>
            <Box color="chakra-body-text" w="100%" maxW="752px">
              <Input
                bgColor={"white"}
                color="black"
                placeholder="Libellé FCIL"
                disabled={true}
              />
            </Box>
          </Flex>
        </FormControl>
      </LightMode>
    );
  }
);
