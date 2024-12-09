"use client";

import { Box } from "@chakra-ui/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box p="0" display="flex" flexDirection={"column"} flex="1" minHeight="100%">
      {children}
    </Box>
  );
}
