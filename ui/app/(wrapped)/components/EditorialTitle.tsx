import { Box, Heading } from "@chakra-ui/react";

import { themeDefinition } from "@/theme/theme";

interface EditorialTitleProps {
  children: React.ReactNode;
}

export const EditorialTitle = ({ children }: EditorialTitleProps) => {
  return (
    <Box>
      <Heading fontSize="20px" as="h3" fontWeight={700} textAlign="center">
        {children}
      </Heading>
      <hr
        style={{
          backgroundColor: themeDefinition.colors.grey[900],
          width: "48px",
          margin: "24px auto 0",
          display: "block",
        }}
      />
    </Box>
  );
};
