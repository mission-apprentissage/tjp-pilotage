"use client";
import { Box } from "@chakra-ui/react";

export const PageContent = ({ children }: { children: React.ReactNode }) => (
  <Box display="flex" flexDirection="column" flex={1} minHeight="0">
    {children}
  </Box>
);
