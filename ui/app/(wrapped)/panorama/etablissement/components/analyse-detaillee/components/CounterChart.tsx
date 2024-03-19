import { Flex, Text } from "@chakra-ui/react";

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
      <Text fontSize={"12px"} fontWeight={"400"} color={"grey.425"}>
        Indisponible
      </Text>
    );
  }

  return (
    <Flex justify={"space-between"} direction={"row"} width={"100%"}>
      <Flex align={"flex-end"}>
        <Text fontSize={"36px"} lineHeight={"36px"} fontWeight={"700"}>
          {data}
        </Text>
        {type === "percentage" && (
          <Text fontSize={"14px"} fontWeight={"400"}>
            &nbsp;%
          </Text>
        )}
      </Flex>
      <Flex align={"flex-end"} fontSize={"12px"}>
        {compareData}
      </Flex>
    </Flex>
  );
};
