import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

export const Tag = ({
  children,
  type = "neutral",
}: {
  children: ReactNode;
  type: "neutral" | "warning" | "danger";
}) => {
  let bgColor;
  if (type === "neutral") bgColor = "blue.200";
  else if (type === "warning") bgColor = "orange.200";
  else bgColor = "red.200";
  return (
    <Box
      borderRadius={5}
      bg={bgColor}
      color={"white"}
      px={2}
      pb={1}
      mx={2}
      height={7}
      whiteSpace={"nowrap"}
    >
      {children}
    </Box>
  );
};
