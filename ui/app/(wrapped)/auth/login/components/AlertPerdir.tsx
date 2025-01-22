"use client";

import { Box, Container, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";

import { themeDefinition } from "@/theme/theme";

const AlertPerdir = () => {
  const [open, setOpen] = useState(true);

  return (
    <Container maxW="container.lg" paddingX="12px" display={open ? "block" : "none"}>
      <Stack
        direction={{
          base: "column",
          md: "row",
        }}
        borderColor={themeDefinition.colors.info.text}
        borderWidth={1}
      >
        <HStack
          flexGrow={0}
          width={{
            base: "100%",
            lg: "auto",
          }}
          backgroundColor={themeDefinition.colors.info.text}
          padding="8px"
          alignItems="start"
          justifyContent="space-between"
        >
          <Icon display="block" color="white" icon="ri:file-info-fill" width="24px" height="24px" />
          <Box
            display={{
              base: "block",
              lg: "none",
            }}
          >
            <Icon
              onClick={() => setOpen(false)}
              color="white"
              cursor="pointer"
              icon="ri:close-fill"
              width="24px"
              height="24px"
            />
          </Box>
        </HStack>
        <Box paddingX="8px" paddingY="16px" flexGrow={1}>
          <VStack spacing="4px" alignItems="start">
            <Text fontSize={16}>
              Chers utilisateurs, le mode connecté est réservé aux Recteurs et DRAFPIC (d'autres accès seront fournis
              directement par les RA dans quelques semaines). Les chefs d’établissement se connectent via le portail
              Arena (enquête et pilotage).
            </Text>
          </VStack>
        </Box>
        <Box
          padding="8px"
          display={{
            base: "none",
            lg: "block",
          }}
        >
          <Icon
            onClick={() => setOpen(false)}
            color={themeDefinition.colors.bluefrance[113]}
            display="block"
            cursor="pointer"
            icon="ri:close-fill"
            width="24px"
            height="24px"
          />
        </Box>
      </Stack>
    </Container>
  );
};

export default AlertPerdir;
