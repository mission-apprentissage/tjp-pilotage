import { Box, chakra } from "@chakra-ui/react";
import type { ReactNode } from "react";

export const SectionBlock = chakra(({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <Box bg="white" p="6" borderRadius={6} className={className}>
      {children}
    </Box>
  );
});
