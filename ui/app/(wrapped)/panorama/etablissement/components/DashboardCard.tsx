import { Flex, Text } from "@chakra-ui/react";

export const DashboardCard = ({
  label,
  tooltip,
  children,
}: {
  label: string;
  tooltip?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  return (
    <Flex
      borderWidth={"1px"}
      borderColor="grey.925"
      borderRadius={"4px"}
      padding={"16px"}
      minH={"200px"}
      h="100%"
      flexDirection={"column"}
    >
      <Flex justifyContent={"space-between"} flex={1}>
        <Text fontSize={"14"} fontWeight={400} lineHeight={"19px"}>
          {label}
        </Text>
        {tooltip}
      </Flex>
      <Flex>{children}</Flex>
    </Flex>
  );
};
