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
  return (
    <Flex justify={"space-between"} direction={"row"} width={"100%"}>
      {data ? (
        <>
          <Flex mb="unset" mt="auto" align={"flex-end"}>
            <Text fontSize={"36px"} lineHeight={"36px"} fontWeight={"700"}>
              {data}
            </Text>
            {type === "percentage" && (
              <Text fontSize={"14px"} fontWeight={"400"}>
                &nbsp;%
              </Text>
            )}
          </Flex>
          <Flex
            shrink={0}
            justify={"end"}
            direction={"column"}
            mb="unset"
            fontSize={"12px"}
          >
            <Flex>{compareData}</Flex>
          </Flex>
        </>
      ) : (
        <>
          <Flex
            fontSize={"11px"}
            lineHeight={"14px"}
            fontWeight={"400"}
            color={"grey.425"}
          >
            Indisponible
          </Flex>
        </>
      )}
    </Flex>
  );
};
