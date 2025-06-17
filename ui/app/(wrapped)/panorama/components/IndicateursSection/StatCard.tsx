import { Card, CardBody, chakra, Flex, Heading, Tooltip } from "@chakra-ui/react";
import type { ReactNode } from "react";

export const StatCard = chakra(
  ({
    label,
    value,
    color = "inherit",
    tooltip,
    type = "absolute",
    badge,
    sub,
    glossaire,
  }: {
    label: ReactNode;
    value?: string | number;
    color?: string;
    tooltip?: string;
    type?: "absolute" | "percentage";
    badge?: ReactNode;
    sub?: ReactNode;
    glossaire?: ReactNode;
  }) => (
    <Card>
      <CardBody
        color={color}
        p={5}
        display={"flex"}
        gap={2}
        flexDir={"column"}
      >
        <Heading as="h2" fontSize={14} display={"inline"}>
          {label}
          {glossaire}
        </Heading>
        {badge}
        <Flex direction="column" mt={"auto"}>
          <Tooltip label={tooltip} placement="left">
            <Flex direction={"row"} alignItems={"baseline"}>
              <Heading as="h3" fontWeight="bold" fontSize="40px">
                {value}
              </Heading>
            </Flex>
          </Tooltip>
          {sub}
        </Flex>
      </CardBody>
    </Card>
  )
);
