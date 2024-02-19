import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { Flex, ResponsiveValue, Text, chakra } from "@chakra-ui/react";
import { GlossaireEntryKey } from "../app/(wrapped)/glossaire/GlossaireEntries";
import { useGlossaireContext } from "../app/(wrapped)/glossaire/glossaireContext";

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
    iconSize?: ResponsiveValue<number | (string & {})>;
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
