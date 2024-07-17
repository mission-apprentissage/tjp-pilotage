import { Box, Flex, Text, VStack } from "@chakra-ui/react";

export const effectifSizes = [
  { min: undefined, max: 50, size: 6 },
  { min: 50, max: 199, size: 10 },
  { min: 200, max: 499, size: 14 },
  { min: 500, max: 999, size: 18 },
  { min: 1000, max: undefined, size: 22 },
];

export const InfoTooltipContent = () => (
  <>
    <Text mt="4" mr={"24px"} mb="2" fontSize="sm" fontWeight="bold">
      Effectif en entrée :
    </Text>
    <VStack align="flex-start" spacing={2}>
      {effectifSizes.map(({ min, max, size }) => (
        <Flex key={`${min}_${max}_${size}`} align="center">
          <Box
            borderRadius={100}
            width={`${size}px`}
            height={`${size}px`}
            mx={`${22 - size / 2}`}
            border="1px solid black"
          />
          <Text flex={1} ml="4" fontSize="sm">
            {typeof min === "undefined" && (
              <>
                {"<"} {max}
              </>
            )}
            {typeof max === "undefined" && (
              <>
                {">"} {min}
              </>
            )}
            {typeof min !== "undefined" && typeof max !== "undefined" && (
              <>
                {min} à {max}
              </>
            )}
          </Text>
        </Flex>
      ))}
    </VStack>
  </>
);
