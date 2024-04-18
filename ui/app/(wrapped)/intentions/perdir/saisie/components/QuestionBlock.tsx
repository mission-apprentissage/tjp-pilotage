import { Box, chakra, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

export const QuestionBlock = chakra(
  ({
    children,
    className,
    active = false,
  }: {
    children: ReactNode;
    className?: string;
    active?: boolean;
  }) => {
    return (
      <Box
        className={className}
        bgColor={active ? "bluefrance.975" : "white"}
        borderRadius={6}
        maxW={"626px"}
        p={active ? 4 : 0}
      >
        <Flex direction="column" gap={6}>
          {children}
        </Flex>
      </Box>
    );
  }
);
