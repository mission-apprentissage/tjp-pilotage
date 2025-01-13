"use client";

import { Box, chakra, CloseButton, Heading, Stack, VisuallyHidden } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";

import { isProduction, publicConfig } from "@/config.public";
import { themeDefinition } from "@/theme/theme";

export const EnvBandeau = chakra(() => {
  const [open, setOpen] = useState(true);
  if (isProduction) return null;
  return (
    <Box
      backgroundColor={themeDefinition.colors.redmarianne[925]}
      color={themeDefinition.colors.redmarianne[625]}
      width="100%"
      py={1}
      display={open ? "block" : "none"}
    >
      <Stack
        maxWidth={"container.xl"}
        margin="auto"
        display="flex"
        direction="row"
        justifyContent="space-between"
        flexWrap="nowrap"
        spacing="3"
        px={5}
        textAlign={"center"}
      >
        <Icon icon="ri:information-fill" fontSize="24px" style={{ margin: "auto" }} />
        <Heading as="h1"
          flexGrow={1}
          fontSize="20px"
          fontWeight={700}
          display={{
            base: "none",
            md: "block",
          }}
          textTransform={"uppercase"}
        >
          {publicConfig.env}
        </Heading>
        <CloseButton
          onClick={() => setOpen(false)}
          variant="inline"
          display="flex"
          padding="0"
          flexDirection="row"
          justifyItems="end"
          alignItems="start"
          width="auto"
          height="auto"
        >
          <VisuallyHidden fontSize={12}>Fermer</VisuallyHidden>
          <Icon icon="ri:close-fill" fontSize="24px" style={{ margin: "auto" }} />
        </CloseButton>
      </Stack>
    </Box>
  );
});
