import { Badge } from "@chakra-ui/react";
import type { VoieType } from "shared";
import { VoieEnum  } from "shared";

export const BadgeVoieScolaire = ({
  voie,
  labelSize = "short",
  size = "xs",
}: {
  voie?: VoieType;
  labelSize?: "short" | "long";
  size?: "xs" | "sm" | "md";
}) => {
  if (!voie || voie !== VoieEnum.scolaire) {
    return null;
  }

  return (
    <Badge variant="info" size={size}>
      {labelSize === "short" && "Sco"}
      {labelSize === "long" && "Scolaire"}
    </Badge>
  );
};
