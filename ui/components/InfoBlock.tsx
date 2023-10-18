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
        <Text mb="1" fontWeight="medium">
          {label}
        </Text>
        <Text py="1" px="1.5" bg="#EEEEEE">
          {value}
        </Text>
      </Box>
    );
  }
);
