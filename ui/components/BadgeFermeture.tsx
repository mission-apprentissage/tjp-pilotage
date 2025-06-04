import type { BoxProps } from "@chakra-ui/react";
import { Badge, chakra } from "@chakra-ui/react";

export const BadgeFermeture = chakra(({
  dateFermeture,
  labelSize = "short",
  size = "xs",
  ...props
}: {
  dateFermeture?: string;
  labelSize?: "short" | "long";
  size?: "xs" | "sm" | "md" | "lg";
  props?: BoxProps
}) => {
  if (!dateFermeture) {
    return null;
  }

  return (
    <Badge variant={"grey"} size={size} {...props}>
      {labelSize === "long" ? `Fermeture au ${dateFermeture}` : dateFermeture}
    </Badge>
  );
});
