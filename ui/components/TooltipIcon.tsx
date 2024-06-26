import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { chakra, Placement, Tooltip } from "@chakra-ui/react";
import { MouseEventHandler, ReactNode } from "react";

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
