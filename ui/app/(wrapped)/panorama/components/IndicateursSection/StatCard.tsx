import { Card, CardBody, chakra, Flex, Heading, Tooltip } from "@chakra-ui/react";
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
        <Heading as="h2" fontSize={14} display={"inline"}>
          {label}
          {glossaire}
        </Heading>
        <Flex direction="column">
          <Tooltip label={tooltip} placement="left">
            <Flex direction={"row"} alignItems={"baseline"}>
              <Heading as="h3" fontWeight="bold" fontSize="40px">
                {value ?? "-"}
              </Heading>
              {type === "percentage" && typeof value !== "undefined" && (
                <Heading as="h3" fontSize={"22px"} fontWeight={"bold"}>
                  &nbsp;%
                </Heading>
              )}
            </Flex>
          </Tooltip>
          {sub}
        </Flex>
      </CardBody>
    </Card>
  )
);
