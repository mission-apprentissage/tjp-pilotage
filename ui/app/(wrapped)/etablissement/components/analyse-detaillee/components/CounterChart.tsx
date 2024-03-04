import { Flex } from "@chakra-ui/react";

export const CounterChart = ({
  data,
  compareData,
  type = "absolute",
}: {
  data?: number;
  compareData?: React.ReactNode;
  type?: "absolute" | "percentage";
}) => {
  return (
    <Flex justify={"space-between"} direction={"row"} width={"100%"}>
      {data ? (
        <>
          <Flex
            fontSize={"40px"}
            lineHeight={"45px"}
            fontWeight={"700"}
            mb="unset"
            mt="auto"
          >
            {data}
            {type === "percentage" ? "%" : ""}
          </Flex>
          <Flex shrink={0} justify={"end"} direction={"column"} mb="unset">
            <Flex>{compareData}</Flex>
          </Flex>
        </>
      ) : (
        <>
          <Flex
            fontSize={"12px"}
            lineHeight={"14px"}
            fontWeight={"400"}
            color={"grey.450"}
          >
            Indisponible
          </Flex>
        </>
      )}
    </Flex>
  );
};
