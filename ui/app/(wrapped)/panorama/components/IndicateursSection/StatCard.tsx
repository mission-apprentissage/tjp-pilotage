import { Card, CardBody, chakra, Flex, Text, Tooltip } from "@chakra-ui/react";
import type { ReactNode } from "react";

export const StatCard = chakra(
  ({
    label,
    value,
    color = "inherit",
    tooltip,
    type = "absolute",
    sub,
    glossaire,
  }: {
    label: ReactNode;
    value?: string | number;
    color?: string;
    tooltip?: string;
    type?: "absolute" | "percentage";
    sub?: ReactNode;
    glossaire?: ReactNode;
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
        <Text fontSize={"14px"} display={"inline"}>
          {label}
          {glossaire}
        </Text>
        <Flex direction="column">
          <Tooltip label={tooltip} placement="left">
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
          {sub}
        </Flex>
      </CardBody>
    </Card>
  )
);
