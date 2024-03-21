import { Flex, FlexProps, forwardRef, Text } from "@chakra-ui/react";

type DashboardCardProps = FlexProps & {
  label: string;
  tooltip?: React.ReactNode;
  children?: React.ReactNode;
};

export const DashboardCard = forwardRef<DashboardCardProps, "div">(
  ({ label, tooltip, children, ...rest }, ref) => (
    <Flex
      borderWidth={"1px"}
      borderColor="grey.925"
      borderRadius={"4px"}
      padding={"16px"}
      minH={"200px"}
      h="100%"
      flexDirection={"column"}
      ref={ref}
      {...rest}
    >
      <Flex justifyContent={"space-between"} flex={1}>
        <Text fontSize={"14"} fontWeight={400} lineHeight={"19px"}>
          {label}
        </Text>
        {tooltip}
      </Flex>
      <Flex>{children}</Flex>
    </Flex>
  )
);
