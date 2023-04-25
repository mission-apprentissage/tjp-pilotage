"use client";
import { Box, chakra } from "@chakra-ui/react";
import { memo } from "react";

export const Graph = memo(
  chakra(
    ({
      value = 50,
      centered = false,
      className,
    }: {
      value: number;
      centered?: boolean;
      className?: string;
    }) => (
      <Box
        className={className}
        bg="grey.900"
        height="10px"
        position="relative"
        borderRadius="4"
        overflow="hidden"
      >
        {!centered && (
          <Box
            height="100%"
            borderRightRadius="4"
            bg={value >= 0 ? "bluefrance.525" : "redmarianne.625"}
            width={`${Math.abs(value)}%`}
          ></Box>
        )}
        {centered && (
          <Box
            height="100%"
            borderRightRadius={value >= 0 ? "4" : "0"}
            borderLeftRadius={value < 0 ? "4" : "0"}
            bg={value >= 0 ? "bluefrance.525" : "redmarianne.625"}
            width={`${Math.min(Math.abs(value), 100) / 2}%`}
            mr={value < 0 ? "50%" : "auto"}
            ml={value >= 0 ? "50%" : "auto"}
          ></Box>
        )}
      </Box>
    )
  )
);
