import type { BadgeProps} from '@chakra-ui/react';
import {Badge, chakra} from '@chakra-ui/react';

export const BadgeFormationRenovee = chakra(({
  isFormationRenovee,
  labelSize = "short",
  size = "xs",
  fontSize,
  ...props
}: {
  isFormationRenovee?: boolean;
  labelSize?: "short" | "long";
  size?: "xs" | "sm" | "md";
  fontSize?: string;
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
      fontSize={fontSize}
      {...props}
    >
      {labelSize === "short" ? "RÉNO" : "RÉNOVÉE"}
    </Badge>
  );
});

