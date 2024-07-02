import { Card, CardBody, chakra, Flex, Text, Tooltip } from "@chakra-ui/react";

export const StatCard = chakra(
  ({
    label,
    value,
    color = "inherit",
    tooltip,
    type = "absolute",
  }: {
    label: string;
    value?: string | number;
    color?: string;
    tooltip?: string;
    type?: "absolute" | "percentage";
  }) => (
    <Card>
      <CardBody
        color={color}
        p={"16px"}
        justifyContent={"space-between"}
        display={"flex"}
        gap={["4px", null, "8px"]}
        flexDir={"column"}
      >
        <Text fontSize={"14px"}>{label}</Text>
        <Tooltip label={tooltip}>
          <Flex direction={"row"} alignItems={"baseline"}>
            <Text fontWeight="bold" fontSize="40px">
              {value ?? "-"}
            </Text>
            {type === "percentage" && typeof value !== "undefined" && (
              <Text fontSize={"22px"} fontWeight={"bold"}>
                &nbsp;%
              </Text>
            )}
          </Flex>
        </Tooltip>
      </CardBody>
    </Card>
  )
);
