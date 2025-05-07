import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { chakra, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger } from "@chakra-ui/react";
import type { MouseEventHandler, ReactNode } from "react";

export const PopoverIcon = chakra(
  ({
    className,
    onClick,
    header,
    children
  }: {
    className?: string;
    onClick?: MouseEventHandler<SVGElement>;
    header?: ReactNode;
    children?: ReactNode;
  }) => {
    return (
      <Popover>
        <PopoverTrigger>
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
        </PopoverTrigger>
        <PopoverContent w="fit-content" maxW="45rem">
          <PopoverArrow />
          <PopoverHeader>{header}</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            {children}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  }
);
