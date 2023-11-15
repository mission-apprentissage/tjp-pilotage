"use client";
import { Box, chakra, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

export const InfoBlock = chakra(
  ({
    label,
    value,
    className,
    textBg = "grey.950",
  }: {
    label: ReactNode;
    value: ReactNode;
    className?: string;
    textBg?: string;
  }) => {
    return (
      <Box className={className}>
        <Text mb="1" fontWeight="medium">
          {label}
        </Text>
        <Text py="1" px="1.5" bg={textBg}>
          {value}
        </Text>
      </Box>
    );
  }
);
