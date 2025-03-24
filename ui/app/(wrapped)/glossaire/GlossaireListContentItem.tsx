import { Flex, Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

import { GlossaireIcon } from "./GlossaireIcon";
import { TypeBadge } from "./TypeBadge";
import type { GlossaireEntryContent } from "./types";

const highlightText = (text?: string, highlight?: string) => {
  if (!text) {
    return [""];
  }

  if (!highlight) {
    return [text];
  }

  const start = text.toLowerCase().indexOf(highlight.trim().toLowerCase());

  if (start === -1) {
    return [text];
  }

  const end = start + highlight.length;

  return [text.slice(0, start), <strong key={`${text}_match`}>{text.slice(start, end)}</strong>, text.slice(end)];
};



export const GlossaireListContentItem = ({
  entry,
  searchValue,
  selectEntry,
}: {
  entry: GlossaireEntryContent;
  searchValue: string;
  selectEntry: (id: string) => void;
}) => {
  return (
    <Flex
      key={entry.slug}
      justifyContent={"space-between"}
      alignItems={"center"}
      color={"bluefrance.113"}
      padding={"24px 12px"}
      _hover={{ backgroundColor: "grey.950" }}
      width={"100%"}
      onClick={() => selectEntry(entry.slug)}
    >
      <Flex>
        {entry.icon && <GlossaireIcon icon={entry.icon} size={"24px"} marginRight={"12px"} />}
        <Text fontSize={"lg"}>{highlightText(entry.title, searchValue)}</Text>
      </Flex>
      <Flex>
        {entry.type && <TypeBadge type={entry.type} />}
        <Icon icon={"ri:arrow-right-s-line"} height={"24px"} />
      </Flex>
    </Flex>
  );
};
