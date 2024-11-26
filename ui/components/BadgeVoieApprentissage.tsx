import { Badge } from "@chakra-ui/react";
import type { Voie } from "shared";

export const BadgeVoieApprentissage = ({
  voie,
  labelSize = "short",
  size = "xs",
}: {
  voie?: Voie;
  labelSize?: "short" | "long";
  size?: "xs" | "sm" | "md";
}) => {
  if (!voie || voie !== "apprentissage") {
    return null;
  }

  return (
    <Badge variant={"new"} size={size}>
      {labelSize === "short" && "Appr"}
      {labelSize === "long" && "Apprentissage"}
    </Badge>
  );
};
