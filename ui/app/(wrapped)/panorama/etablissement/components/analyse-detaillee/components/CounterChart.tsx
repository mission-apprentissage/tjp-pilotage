import { Flex, Heading, Text } from "@chakra-ui/react";

export const CounterChart = ({
  data,
  compareData,
  type = "absolute",
}: {
  data?: number | string;
  compareData?: React.ReactNode;
  type?: "absolute" | "percentage";
}) => {
  if (typeof data === "undefined") {
    return (
      <Text fontSize={12} fontWeight={"400"} color={"grey.425"}>
        Indisponible
      </Text>
    );
  }

  return (
    <Flex justify={"space-between"} direction={"row"} width={"100%"}>
      <Flex align={"flex-end"}>
        <Heading as="h4" fontSize={"36px"} lineHeight={"36px"} fontWeight={"700"}>
          {data}
        </Heading>
        {type === "percentage" && data && data !== "-" && (
          <Heading as="h4" fontSize={14} fontWeight={"400"}>
            &nbsp;%
          </Heading>
        )}
      </Flex>
      <Flex align={"flex-end"} fontSize={12}>
        {compareData}
      </Flex>
    </Flex>
  );
};
