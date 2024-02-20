import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { chakra, Flex, ResponsiveValue, Text } from "@chakra-ui/react";

import { useGlossaireContext } from "../app/(wrapped)/glossaire/glossaireContext";
import { GlossaireEntryKey } from "../app/(wrapped)/glossaire/GlossaireEntries";

export const GlossaireShortcut = chakra(
  ({
    className,
    label,
    glossaireEntryKey,
    iconSize,
  }: {
    className?: string;
    label?: string;
    glossaireEntryKey?: GlossaireEntryKey;
    iconSize?: ResponsiveValue<number | string>;
  }) => {
    const { onOpen } = useGlossaireContext();
    return (
      <Flex
        alignItems={"center"}
        className={className}
        _hover={{ cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation();
          onOpen(glossaireEntryKey);
        }}
      >
        <QuestionOutlineIcon height={iconSize} width={iconSize} />
        {label && <Text marginLeft={2}>{label}</Text>}
      </Flex>
    );
  }
);
