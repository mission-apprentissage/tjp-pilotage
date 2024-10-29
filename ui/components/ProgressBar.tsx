import { Flex, Text } from "@chakra-ui/react";

const ProgressBar = ({
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
    <Flex flexDirection={"column"} width="100%">
      <Flex w="100%" bgColor="gray.100" justifyContent={"space-between"} borderRadius={"4px"}>
        <Flex
          w={`${percentage < 100 ? percentage : 100}%`}
          bgColor={colorScheme}
          fontSize="10px"
          overflow={"visible"}
          height="15px"
          borderLeftRadius={"inherit"}
          borderRightRadius={percentage >= 100 ? "inherit" : "none"}
        >
          <Text textOverflow={"hidden"} whiteSpace={"nowrap"} lineHeight="12px" my="auto" fontSize="10px" ps={1}>
            {leftLabel}
          </Text>
        </Flex>
        <Flex
          w={`${100 - percentage > 0 ? 100 - percentage : 0}%`}
          fontSize="10px"
          overflow={"visible"}
          height="15px"
          justifyContent={"end"}
          borderLeftRadius={percentage === 0 ? "inherit" : "none"}
          borderRightRadius={percentage >= 100 ? "inherit" : "none"}
        >
          <Text textOverflow={"hidden"} whiteSpace={"nowrap"} lineHeight="12px" my="auto" fontSize="10px" pe={1}>
            {rightLabel}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export { ProgressBar };
