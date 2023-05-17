import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { chakra, Tooltip } from "@chakra-ui/react";
import { ReactNode } from "react";

export const TooltipIcon = chakra(
  ({ label, className }: { label: ReactNode; className?: string }) => {
    return (
      <Tooltip maxWidth={180} label={label}>
        <QuestionOutlineIcon className={className} />
      </Tooltip>
    );
  }
);
