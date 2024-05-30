import { Flex, Text, useToken } from "@chakra-ui/react";

export const RequiredField = () => {
  const red = useToken("colors", "error.425");
  return (
    <Flex direction="row" mt={"42px"}>
      <Text fontWeight={"bold"} color={red}>
        (*)
      </Text>
      <Text ml={2} color={"grey.425"}>
        Champ obligatoire
      </Text>
    </Flex>
  );
};
