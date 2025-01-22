import { Box, Heading } from "@chakra-ui/react";

import { themeDefinition } from "@/theme/theme";

interface EditorialTitleProps {
  children: React.ReactNode;
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const EditorialTitle = ({ children, headingLevel }: EditorialTitleProps) => {
  return (
    <Box>
      <Heading fontSize="20px" as={headingLevel} fontWeight={700} textAlign="center">
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
