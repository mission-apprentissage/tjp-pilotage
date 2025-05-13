import type { BadgeProps } from "@chakra-ui/react";
import { Badge, forwardRef } from "@chakra-ui/react";

type BadgeFormationRenoveeProps = BadgeProps & {
  isFormationRenovee: boolean;
};

export const BadgeFormationRenovee = forwardRef<BadgeFormationRenoveeProps, "span">(
  ({ isFormationRenovee, ...rest }, ref) => {
    if (!isFormationRenovee) {
      return null;
    }

    return (
      <Badge
        ms={2}
        my={"auto"}
        bgColor={"greenArchipel.950"}
        color={"greenArchipel.391"}
        h={"fit-content"}
        flex={"shrink"}
        ref={ref}
        {...rest}
      >
        RÉNOVÉE
      </Badge>
    );
  }
);
