import { Badge, BadgeProps, forwardRef } from "@chakra-ui/react";
import { Scope } from "shared";

type BadgeScopeProps = BadgeProps & {
  scope: Scope;
};

export const BadgeScope = forwardRef<BadgeScopeProps, "span">(
  ({ scope, ...rest }: { scope: Scope }, ref) => {
    return (
      <Badge
        bgColor={
          {
            national: "purpleGlycine.950",
            région: "greenArchipel.950",
            académie: "brownCafeCreme.950",
            département: "#FFE8E5",
          }[scope]
        }
        color={
          {
            national: "purpleGlycine.494",
            région: "greenArchipel.391",
            académie: "brownCafeCreme.383",
            département: "orangeTerreBattue.645",
          }[scope]
        }
        fontWeight={"normal"}
        textTransform={"capitalize"}
        ref={ref}
        {...rest}
      >
        {scope}
      </Badge>
    );
  }
);
