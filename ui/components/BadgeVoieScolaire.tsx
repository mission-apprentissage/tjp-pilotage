import type { BadgeProps} from '@chakra-ui/react';
import {Badge} from '@chakra-ui/react';
import type { VoieType } from "shared";
import { VoieEnum  } from "shared";

export const BadgeVoieScolaire = ({
  voie,
  labelSize = "short",
  size = "xs",
  ...props
}: {
  voie?: VoieType;
  labelSize?: "short" | "long";
  size?: "xs" | "sm" | "md";
  props?: BadgeProps
}) => {
  if (!voie || voie !== VoieEnum.scolaire) {
    return null;
  }

  return (
    <Badge variant="info" size={size} {...props}>
      {labelSize === "short" && "Sco"}
      {labelSize === "long" && "Scolaire"}
    </Badge>
  );
};
