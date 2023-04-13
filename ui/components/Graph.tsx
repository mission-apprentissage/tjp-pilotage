"use client";
import { Box, chakra, Flex } from "@chakra-ui/react";

export const Graph = chakra(
  ({ value = 50, className }: { value: number; className?: string }) => (
    <Flex
      className={className}
      bg="grey.900"
      height="10px"
      position="relative"
      borderRadius="4"
      overflow="hidden"
    >
      <Box
        height="100%"
        borderRightRadius="4"
        bg="bluefrance.113"
        width={`${value}%`}
      ></Box>
    </Flex>
  )
);
