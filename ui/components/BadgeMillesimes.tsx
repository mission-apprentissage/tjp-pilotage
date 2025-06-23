import type { BadgeProps } from "@chakra-ui/react";
import { Badge, chakra } from "@chakra-ui/react";

import {formatMillesime} from '@/utils/formatLibelle';

export const BadgeMillesimes = chakra(({
  millesimes,
  labelSize = "long",
  size = "xs",
  fontSize,
  ...props
}: {
  millesimes?: string;
  labelSize?: "short" | "long";
  size?: "xs" | "sm" | "md";
  fontSize?: string;
  props?: BadgeProps
}) => {
  if (!millesimes) return null;

  return (
    <Badge variant={"info"} size={size} fontSize={fontSize} {...props}>
      {labelSize === "short" ? formatMillesime(millesimes) : `Millésimes ${formatMillesime(millesimes)}`}
    </Badge>
  );
});
