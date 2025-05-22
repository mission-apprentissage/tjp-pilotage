import type { BoxProps } from "@chakra-ui/react";
import {Badge, chakra} from '@chakra-ui/react';
import type { VoieType } from "shared";

export const BadgeVoieApprentissage = chakra(({
  voie,
  labelSize = "short",
  size,
  ...props
}: {
  voie?: VoieType;
  labelSize?: "short" | "long";
  size: "xs" | "sm" | "md" | "lg";
  props?: BoxProps
}) => {
  if (!voie || voie !== "apprentissage") {
    return null;
  }

  return (
    <Badge
      variant={"new"}
      size={size}
      {...props}
    >
      {labelSize === "short" && "Appr"}
      {labelSize === "long" && "Apprentissage"}
    </Badge>
  );
});
