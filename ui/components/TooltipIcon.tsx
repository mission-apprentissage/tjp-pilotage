import { QuestionOutlineIcon } from "@chakra-ui/icons";
import type { Placement } from "@chakra-ui/react";
import { chakra, Tooltip } from "@chakra-ui/react";
import type { MouseEventHandler, ReactNode } from "react";

export const TooltipIcon = chakra(
  ({
    label,
    className,
    onClick,
    placement,
  }: {
    label?: ReactNode;
    className?: string;
    onClick?: MouseEventHandler<SVGElement> | undefined;
    placement?: Placement;
  }) => {
    return (
      <Tooltip label={label} placement={placement}>
        <QuestionOutlineIcon
          cursor="pointer"
          className={className}
          onClick={(e) => {
            if (onClick) {
              e.stopPropagation();
              onClick(e);
            }
          }}
        />
      </Tooltip>
    );
  }
);
