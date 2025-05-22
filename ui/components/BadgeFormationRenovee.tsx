import type { BadgeProps} from '@chakra-ui/react';
import {Badge, chakra} from '@chakra-ui/react';

export const BadgeFormationRenovee = chakra(({
  isFormationRenovee,
  labelSize = "short",
  size = "xs",
  ...props
}: {
  isFormationRenovee?: boolean;
  labelSize?: "short" | "long";
  size: "xs" | "sm" | "md" | "lg";
  props?: BadgeProps
}) => {
  if (!isFormationRenovee) {
    return null;
  }

  return (
    <Badge
      my={"auto"}
      bgColor={"greenArchipel.950"}
      color={"greenArchipel.391"}
      h={"fit-content"}
      flex={"shrink"}
      size={size}
      {...props}
    >
      {labelSize === "short" ? "Réno" : "Rénovée"}
    </Badge>
  );
});

