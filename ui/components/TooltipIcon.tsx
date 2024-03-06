import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { chakra, Tooltip } from "@chakra-ui/react";
import { MouseEventHandler, ReactNode } from "react";

export const TooltipIcon = chakra(
  ({
    label,
    className,
    onClick,
  }: {
    label: ReactNode;
    className?: string;
    onClick?: MouseEventHandler<SVGElement> | undefined;
  }) => {
    return (
      <Tooltip maxWidth={180} label={label}>
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
