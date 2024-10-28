"use client";
import { Box, chakra, Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

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
        <Flex mb="1" fontWeight="500">
          {label}
        </Flex>
        <Flex py="1" px="1.5" bg={textBg}>
          {value}
        </Flex>
      </Box>
    );
  }
);
