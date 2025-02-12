import { Flex, Heading } from "@chakra-ui/react";

export const IndicateurCard = ({
  children,
  title,
  tooltip,
}: {
  children: React.ReactNode;
  title: string;
  tooltip?: React.ReactNode;
}) => {
  return (
    <Flex
      direction={"column"}
      flex={1}
      backgroundColor="white"
      borderColor={"grey.900"}
      borderWidth="1px"
      borderRadius="4px"
      borderStyle="solid"
      padding="8px"
      alignItems="start"
      gap={4}
    >
      <Flex direction={"row"} gap={2}>
        <Heading as="h2" color={"bluefrance.113"} fontSize={14} fontWeight="500" lineHeight="24px" textTransform="uppercase">
          {title}
        </Heading>
        {tooltip}
      </Flex>
      <Flex w={"100%"} h={"100%"}>
        {children}
      </Flex>
    </Flex>
  );
};
