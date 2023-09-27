import { Box, chakra } from "@chakra-ui/react";
import { ReactNode } from "react";

export const InfoBox = chakra(
  ({ children, className }: { children: ReactNode; className?: string }) => {
    return (
      <Box
        fontWeight="medium"
        className={className}
        fontSize="sm"
        p="4"
        bg="#F5F5FE"
        color="blue.main"
      >
        {children}
      </Box>
    );
  }
);
