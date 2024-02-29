import { Badge, Flex, GridItem, Text } from "@chakra-ui/react";

export const Indicateurs = ({ millessimes }: { millessimes: string[] }) => {
  return (
    <GridItem colSpan={12}>
      <Flex
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        width={"100%"}
        pb={"16px"}
      >
        <Text fontWeight={"bold"}>
          INDICATEURS ÉTABLISSEMENT (VOIE SCOLAIRE)
        </Text>
        <Badge variant="info" size={"md"}>
          Millésimes {millessimes.join(" + ")}
        </Badge>
      </Flex>
    </GridItem>
  );
};
