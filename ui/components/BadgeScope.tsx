import type { BadgeProps } from "@chakra-ui/react";
import {Badge, chakra} from '@chakra-ui/react';
import type { ScopeZone } from "shared";

type BadgeScopeProps = BadgeProps & {
  scope: ScopeZone;
};

export const BadgeScope = chakra((
  { scope, ...props }:
  BadgeScopeProps,
  ref) => {
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
      {...props}
    >
      {scope}
    </Badge>
  );
});
