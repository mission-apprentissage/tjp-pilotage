"use client";
import { Box } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box
      as="iframe"
      height="100%"
      width="100%"
      src="https://pilotage-recette.trajectoirespro.beta.gouv.fr/metabase/public/dashboard/e917107f-0d3a-4846-8b45-6dc48ed81b6e"
      frameBorder="0"
    />
  );
}
