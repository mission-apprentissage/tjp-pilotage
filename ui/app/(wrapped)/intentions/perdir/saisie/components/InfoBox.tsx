import { Box, chakra } from "@chakra-ui/react";
import type { ReactNode } from "react";

export const InfoBox = chakra(({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <Box fontWeight="medium" className={className} fontSize="sm" p="4" bg="bluefrance.975" color="blueecume.400_hover">
      {children}
    </Box>
  );
});
