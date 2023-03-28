"use client";
import { Box } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box
      as="iframe"
      height="100%"
      width="100%"
      src="https://pilotage-recette.trajectoirespro.beta.gouv.fr/metabase/public/dashboard/7d053592-73d5-4974-a890-6f19938ed690"
      frameBorder="0"
    />
  );
}
