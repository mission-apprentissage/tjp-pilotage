import { QuestionOutlineIcon } from "@chakra-ui/icons";
import type { ResponsiveValue } from "@chakra-ui/react";
import { chakra, Flex, Text, Tooltip } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import type { GlossaireEntryKey } from "@/app/(wrapped)/glossaire/GlossaireEntries";

export const GlossaireShortcut = chakra(
  ({
    className,
    label,
    glossaireEntryKey,
    iconSize,
    tooltip,
  }: {
    className?: string;
    label?: string;
    glossaireEntryKey?: GlossaireEntryKey;
    iconSize?: ResponsiveValue<number | string>;
    tooltip?: React.ReactNode;
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
        <Tooltip label={tooltip}>
          <QuestionOutlineIcon height={iconSize} width={iconSize} />
        </Tooltip>
        {label && <Text marginLeft={2}>{label}</Text>}
      </Flex>
    );
  },
);
