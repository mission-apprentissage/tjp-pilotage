import { Box, chakra } from "@chakra-ui/react";
import type { ReactNode } from "react";

export const TableBadge = chakra(({ children, className }: { children: ReactNode; className?: string }) => (
  <Box className={className} borderRadius="full" py="1" px="3" display="inline-block">
    {children}
  </Box>
));
