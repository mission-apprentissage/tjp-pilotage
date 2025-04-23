"use client";

import { Box } from "@chakra-ui/react";

const Page = ({ children }: { children: React.ReactNode }) =>
  <Box p="0" display="flex" flexDirection={"column"} flex="1" minHeight="100%">
    {children}
  </Box>;

export default Page;
