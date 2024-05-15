import {
  Box,
  CloseButton,
  Collapse,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";

export const InformationHeader = ({
  status = "info",
  message,
}: {
  status?: "success" | "warning" | "info";
  message: string;
}) => {
  const bgColors = {
    success: "success.950",
    warning: "orangeterrebattue.850",
    info: "info.950",
  };

  const colors = {
    success: "info.text",
    warning: "warning.425",
    info: "info.text",
  };

  const [shouldDisplay, setShouldDisplay] = useState(true);

  return (
    <Collapse in={shouldDisplay}>
      <VStack>
        <Box
          backgroundColor={bgColors[status]}
          color={colors[status]}
          width="100%"
          paddingY="12px"
        >
          <Stack
            maxWidth={"container.xl"}
            margin="auto"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            flexWrap="nowrap"
            spacing="16px"
            padding="4px 8px"
          >
            <Icon icon="ri:information-fill" fontSize="24px" />
            <Text
              flexGrow={1}
              fontSize="16px"
              fontWeight={700}
              display={{
                base: "none",
                md: "block",
              }}
            >
              {message}
            </Text>
            <CloseButton
              onClick={() => {
                setShouldDisplay(false);
              }}
              mb={"auto"}
            />
          </Stack>
        </Box>
      </VStack>
    </Collapse>
  );
};
