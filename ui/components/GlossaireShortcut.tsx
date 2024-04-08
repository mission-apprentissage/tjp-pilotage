import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { chakra, Flex, ResponsiveValue, Text, Tooltip } from "@chakra-ui/react";

import { useGlossaireContext } from "../app/(wrapped)/glossaire/glossaireContext";
import { GlossaireEntryKey } from "../app/(wrapped)/glossaire/GlossaireEntries";

export const GlossaireShortcut = chakra(
  ({
    className,
    label,
    glossaireEntryKey,
    iconSize,
    tooltip,
    maxWidthTooltip = 180,
  }: {
    className?: string;
    label?: string;
    glossaireEntryKey?: GlossaireEntryKey;
    iconSize?: ResponsiveValue<number | string>;
    tooltip?: React.ReactNode;
    maxWidthTooltip?: string | number;
  }) => {
    const { openGlossaire } = useGlossaireContext();
    return (
      <Flex
        alignItems={"center"}
        className={className}
        _hover={{ cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation();
          openGlossaire(glossaireEntryKey);
        }}
      >
        <Tooltip label={tooltip} maxWidth={maxWidthTooltip}>
          <QuestionOutlineIcon height={iconSize} width={iconSize} />
        </Tooltip>
        {label && <Text marginLeft={2}>{label}</Text>}
      </Flex>
    );
  }
);
