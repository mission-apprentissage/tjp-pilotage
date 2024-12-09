import type { FlexProps } from "@chakra-ui/react";
import { Box, Flex, forwardRef, Text } from "@chakra-ui/react";

type DashboardCardProps = FlexProps & {
  label: string;
  tooltip?: React.ReactNode;
  children?: React.ReactNode;
  badge?: React.ReactNode;
};

export const DashboardCard = forwardRef<DashboardCardProps, "div">(
  ({ label, tooltip, children, badge, ...rest }, ref) => (
    <Flex
      borderWidth={"1px"}
      borderColor="grey.925"
      borderRadius={"4px"}
      padding={"16px"}
      minH={"200px"}
      h="100%"
      flexDirection={"column"}
      justifyContent={"space-between"}
      gap={"8px"}
      ref={ref}
      {...rest}
    >
      <Box width={"100%"}>
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Text fontSize={"14"} fontWeight={400} lineHeight={"19px"}>
            {label}
          </Text>
          {tooltip}
        </Flex>
        {badge}
      </Box>
      <Flex>{children}</Flex>
    </Flex>
  )
);
