import type { BadgeProps } from "@chakra-ui/react";
import { Badge, chakra } from "@chakra-ui/react";

export const BadgeFermeture = chakra(({
  dateFermeture,
  labelSize = "short",
  size = "xs",
  fontSize,
  ...props
}: {
  dateFermeture?: string;
  labelSize?: "short" | "long";
  size?: "xs" | "sm" | "md";
  fontSize?: string;
  props?: BadgeProps
}) => {
  if (!dateFermeture) {
    return null;
  }

  return (
    <Badge variant={"grey"} size={size} fontSize={fontSize} {...props}>
      {labelSize === "short" ? `Fermeture au ${dateFermeture}` : dateFermeture}
    </Badge>
  );
});
