import { chakra, Flex, Heading } from "@chakra-ui/react";

export const EditoSection = chakra(() => {
  return (
    <Flex
      direction={"column"}
      gap={3}
      bgColor={"white"}
      borderRadius={6}
      p={6}
      minH={"20rem"}
    >
      <Heading as="h2">Edito</Heading>
    </Flex>
  );
});
