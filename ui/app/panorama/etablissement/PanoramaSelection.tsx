"use client";

import {
  AspectRatio,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Img,
  Input,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Breadcrumb } from "@/components/Breadcrumb";

export function PanoramaSelection() {
  const router = useRouter();

  const [uai, setUai] = useState("");

  const handleSubmit = () => {
    console.log("hand", uai);
    router.push(`/panorama/etablissement/${uai}`);
  };

  return (
    <Container
      px="8"
      as="section"
      pb="12"
      pt="6"
      bg="#F9F8F6"
      maxWidth={"container.xl"}
    >
      <Breadcrumb
        pages={[
          { title: "Accueil", to: "/" },
          { title: "Panorama", to: "/panorama", active: true },
        ]}
      />
      <Flex align="center" direction="column">
        <FormControl
          as="form"
          margin="auto"
          maxW="300px"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <FormLabel>Saisissez un code UAI pour commencer</FormLabel>
          <Flex>
            <Input
              flex={1}
              mr="2"
              placeholder="Code UAI"
              onInput={(e) => setUai(e.target.value)}
              variant="input"
            />
            <Button type="submit" variant="primary">
              Valider
            </Button>
          </Flex>
        </FormControl>
        <AspectRatio width="100%" maxW="300px" ratio={2.7} mt="4">
          <Img src="/graphs_statistics.png" objectFit="contain" />
        </AspectRatio>
      </Flex>
    </Container>
  );
}
