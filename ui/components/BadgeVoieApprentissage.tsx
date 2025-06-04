import type { BadgeProps} from '@chakra-ui/react';
import {Badge, chakra} from '@chakra-ui/react';
import type { VoieType } from "shared";
import { VoieEnum  } from "shared";

export const BadgeVoieApprentissage = chakra(({
  voie,
  labelSize = "short",
  size,
  ...props
}: {
  voie?: VoieType;
  labelSize?: "short" | "long";
  size?: "xs" | "sm" | "md" | "lg";
  props?: BadgeProps
}) => {
  if (!voie || voie !== VoieEnum.apprentissage) {
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
