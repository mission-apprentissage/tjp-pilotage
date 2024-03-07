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
          <Flex
            fontSize={"36px"}
            lineHeight={"36px"}
            fontWeight={"700"}
            mb="unset"
            mt="auto"
          >
            {data}
            {type === "percentage" && (
              <Text fontSize={"12px"} lineHeight={"14px"} fontWeight={"400"}>
                %
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
