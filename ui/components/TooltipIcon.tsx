import { QuestionOutlineIcon } from "@chakra-ui/icons";
import type { Placement } from "@chakra-ui/react";
import { chakra, IconButton, Tooltip } from "@chakra-ui/react";
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
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
    placement?: Placement;
  }) => {
    return (
      <Tooltip label={label} placement={placement}>
        <IconButton
          variant="outline"
          minW="auto"
          h="auto"
          p={0}
          m={1}
          aria-label="Tooltip icon"
          cursor="pointer"
          className={className}
          onClick={(e) => {
            if (onClick) {
              e.stopPropagation();
              onClick(e);
            }
          }}
          icon={<QuestionOutlineIcon />}
        ></IconButton>
      </Tooltip>
    );
  }
);
