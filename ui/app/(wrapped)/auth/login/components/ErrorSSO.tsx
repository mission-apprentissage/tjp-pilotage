"use client";

import { Box, Container, Heading, HStack, Link, Stack, Text, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";

const ErrorSSO = () => {
  const [open, setOpen] = useState(true);

  return (
    <Container maxW="container.lg" paddingX="12px" display={open ? "block" : "none"}>
      <Stack
        direction={{
          base: "column",
          md: "row",
        }}
        borderColor="#c9191e"
        borderWidth={1}
      >
        <HStack
          flexGrow={0}
          width={{
            base: "100%",
            lg: "auto",
          }}
          backgroundColor="#c9191e"
          padding="8px"
          alignItems="start"
          justifyContent="space-between"
        >
          <Icon display="block" color="white" icon="ri:error-warning-fill" width="24px" height="24px" />
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
            <Heading as="h3" fontSize="20px" fontWeight={700} textAlign="left">
              Error lors de la connexion avec Arena
            </Heading>
            <Text fontSize="16px">
              Orion utilise les services de la DNE pour vous fournir une connexion unique et sécurisée. Nous n’avons pas
              réussi à établir une connexion au portail Arena pour vous permettre d’accéder à Orion. Merci de ré-essayer
              ultérieurement ou de
              <Link href="mailto:orion@inserjeunes.beta.gouv.fr">contacter le support</Link> si le problème persiste.
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
            color="#c9191e"
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

export default ErrorSSO;
