import { Flex, Text } from "@chakra-ui/react";

export const ProgressBar = ({
  percentage,
  colorScheme = "bluefrance.525",
  leftLabel,
  rightLabel,
}: {
  percentage: number;
  colorScheme?: string;
  leftLabel?: string | number;
  rightLabel?: string | number;
}) => {
  return (
    <Flex direction={"row"} justify={"flex-end"}>
      <Flex minW={"15%"}>
        <Text pe={5} fontSize={14} fontWeight={400} lineHeight={"12px"}>
          {leftLabel}
        </Text>
      </Flex>
      <Flex flex={1} bgColor="gray.100" justifyContent={"space-between"} borderRadius={"4px"}>
        <Flex
          w={`${percentage < 100 ? percentage : 100}%`}
          bgColor={colorScheme}
          fontSize="10px"
          overflow={"visible"}
          height="15px"
          borderLeftRadius={"inherit"}
          borderRightRadius={percentage >= 100 ? "inherit" : "none"}
        />
        <Flex
          w={`${100 - percentage > 0 ? 100 - percentage : 0}%`}
          fontSize="10px"
          overflow={"visible"}
          height="15px"
          justifyContent={"end"}
          borderLeftRadius={percentage === 0 ? "inherit" : "none"}
          borderRightRadius={percentage >= 100 ? "inherit" : "none"}
        />
      </Flex>
      <Flex minW={"10%"}>
        <Text ps={5} fontSize={14} fontWeight={700} lineHeight={"12px"}>
          {rightLabel}
        </Text>
      </Flex>
    </Flex>
  );
};
