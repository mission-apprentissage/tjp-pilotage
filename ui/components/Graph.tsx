"use client";
import { Box, chakra } from "@chakra-ui/react";
import { memo } from "react";

export const Graph = memo(
  chakra(
    ({
      value = 50,
      centered = false,
      className,
      zebra = false,
    }: {
      value: number;
      centered?: boolean;
      className?: string;
      zebra: boolean;
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
            // bg={value >= 0 ? "bluefrance.525" : "redmarianne.625"}
            bgImage="linear-gradient(117deg, #dddddd 25%, #b119ad 25%, #b119ad 50%, #dddddd 50%, #dddddd 75%, #b119ad 75%, #b119ad 100%)"
            bgSize="4.00px 7.85px"
            bg={
              !zebra ? (value >= 0 ? "bluefrance.525" : "redmarianne.625") : ""
            }
            // bg="green"
            width={`${Math.abs(value)}%`}
          />
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
          />
        )}
      </Box>
    )
  )
);
