"use client";
import { Box, chakra, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

export const InfoBlock = chakra(
  ({
    label,
    value,
    className,
  }: {
    label: ReactNode;
    value: ReactNode;
    className?: string;
  }) => {
    return (
      <Box className={className}>
        <Text mb="0.5" fontWeight="bold">
          {label}
        </Text>
        <Text p="1" bg="#EEEEEE">
          {value}
        </Text>
      </Box>
    );
  }
);
