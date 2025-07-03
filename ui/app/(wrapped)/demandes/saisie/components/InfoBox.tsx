import { Box, chakra } from "@chakra-ui/react";
import type { ReactNode } from "react";

export const InfoBox = chakra(({ type = "info", children, className }: { type?: "info" | "danger"; children: ReactNode; className?: string }) => {

  const bgColor = type === "info" ? "bluefrance.975" : "redmarianne.925";
  const textColor = type === "info" ? "blueecume.400_hover" : "redmarianne.625";

  return (
    <Box
      fontWeight="medium"
      fontSize="sm"
      p="4"
      bg={bgColor}
      color={textColor}
      className={className}
    >
      {children}
    </Box>
  );
});
