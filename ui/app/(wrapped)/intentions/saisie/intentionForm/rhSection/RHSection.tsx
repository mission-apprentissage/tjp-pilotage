import { Divider, Flex, Heading } from "@chakra-ui/react";

import { AutreBesoinRHField } from "./AutreBesoinRHField";
import { BesoinRHField } from "./BesoinRHField";

export const RHSection = ({ disabled }: { disabled: boolean }) => {
  return (
    <>
      <Heading as="h2" fontSize="xl" display={"flex"}>
        Ressources Humaines
      </Heading>
      <Divider pt="4" mb="4" />
      <Flex maxW="752px" gap="6" mb="6" direction={"column"}>
        <BesoinRHField disabled={disabled} maxW="752px" mb="6" />
        <AutreBesoinRHField disabled={disabled} mb="6" maxW="752px" />
      </Flex>
    </>
  );
};
