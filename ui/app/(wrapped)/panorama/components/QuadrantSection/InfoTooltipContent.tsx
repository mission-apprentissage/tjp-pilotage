import { Box, Flex, Text, VStack } from "@chakra-ui/react";

export const effectifSizes = [
  { max: 50, size: 6 },
  { max: 200, size: 10 },
  { max: 500, size: 14 },
  { max: 1000, size: 18 },
  { max: 1000000, size: 22 },
];

export const InfoTooltipContent = () => (
  <>
    <Text mt="4" mb="2" fontSize="sm" fontWeight="bold">
      Légende:
    </Text>
    <VStack align="flex-start" spacing={2}>
      {effectifSizes.map(({ max, size }, i) => (
        <Flex key={max} align="center">
          <Box
            borderRadius={100}
            width={`${size}px`}
            height={`${size}px`}
            mx={`${22 - size / 2}`}
            border="1px solid black"
          />
          <Text flex={1} ml="4" fontSize="sm">
            {max !== 1000000 && (
              <>
                Effectif {"<"} {max}
              </>
            )}
            {max === 1000000 && (
              <>
                Effectif {">"} {effectifSizes[i - 1].max}
              </>
            )}
          </Text>
        </Flex>
      ))}
    </VStack>
  </>
);
