import type { BadgeProps } from "@chakra-ui/react";
import { Badge, chakra } from "@chakra-ui/react";


export const BadgeRentreeScolaire = chakra(({
  rentreeScolaire,
  labelSize = "short",
  size = "xs",
  fontSize,
  ...props
}: {
  rentreeScolaire?: string;
  labelSize?: "short" | "long";
  size?: "xs" | "sm" | "md";
  fontSize?: string;
  props?: BadgeProps
}) => {
  if (!rentreeScolaire) return null;

  return (
    <Badge variant={"grey"} size={size} fontSize={fontSize} {...props}>
      {labelSize === "short" ? `RS ${rentreeScolaire}` : `Rentrée scolaire ${rentreeScolaire}`}
    </Badge>
  );
});
