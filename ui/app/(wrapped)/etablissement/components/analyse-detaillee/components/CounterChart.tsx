import { Flex } from "@chakra-ui/react";

export const CounterChart = ({
  data,
  compareData,
  type = "absolute",
}: {
  data?: number;
  compareData?: string;
  type?: "absolute" | "percentage";
}) => {
  return (
    <Flex justifyContent={"space-between"} flexDirection={"row"} width={"100%"}>
      {data ? (
        <>
          <Flex
            fontSize={"40px"}
            lineHeight={"48px"}
            fontWeight={"700"}
            flex={1}
          >
            {data}
            {type === "percentage" ? "%" : ""}
          </Flex>
          <Flex flexShrink={0} justifyContent={"end"} m={"auto"}>
            {compareData}
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
