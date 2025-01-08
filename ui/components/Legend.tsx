import { Box, chakra, Flex, Text } from "@chakra-ui/react";

export const Legend = chakra(
  ({ elements, className }: { elements: { label: string; color: string }[]; className?: string }) => {
    return (
      <Flex className={className} mt={4} ms={2}>
        {elements.map((element, index) => (
          <Flex key={`element-${index}`} me={3}>
            <Box bg={element.color} borderRadius="4px" w="1.375rem" h="1rem" />
            <Text lineHeight={"0.8rem"} fontSize="11px" ms={2}>
              {element.label}
            </Text>
          </Flex>
        ))}
      </Flex>
    );
  },
);
