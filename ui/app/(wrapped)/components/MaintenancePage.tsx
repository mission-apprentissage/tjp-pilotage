import { Center, Flex, Heading, Img, Text } from "@chakra-ui/react";

export const MaintenancePage = () => {
  return (
    <Flex width={"100%"} height={"100%"}>
      <Center display={"flex"} flexDirection={"column"} m={"auto"}>
        <Heading as="h1" fontSize={32}>
          Maintenance en cours
        </Heading>
        <Img src="/illustrations/in-progress.svg" alt="Maintenance en cours" width={60} my={8}/>
        <Text>En cas de demande urgente veuillez contacter</Text>
      </Center>
    </Flex>
  );
};
