import { Badge, Flex, Text, useToken } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

import { GlossaireIcon } from "./GlossaireIcon";
import { GlossaireEntryContent } from "./types";

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

  return [
    text.slice(0, start),
    <strong key={`${text}_match`}>{text.slice(start, end)}</strong>,
    text.slice(end),
  ];
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
  const [blue, yellow, purple, gray, red, green, pink, orange] = useToken(
    "colors",
    ["blue", "yellow", "purple", "gray", "red", "green", "pink", "orange"]
  );

  return (
    <Flex
      key={entry.id}
      justifyContent={"space-between"}
      alignItems={"center"}
      color={"bluefrance.113"}
      padding={"24px 12px"}
      _hover={{ backgroundColor: "grey.950" }}
      width={"100%"}
      onClick={() => selectEntry(entry.id)}
    >
      <Flex>
        <GlossaireIcon icon={entry.icon!} size={"24px"} marginRight={"12px"} />
        <Text fontSize={"lg"}>{highlightText(entry.title, searchValue)}</Text>
      </Flex>
      <Flex>
        {entry.indicator?.name && (
          <Badge
            colorScheme={
              {
                blue,
                yellow,
                purple,
                gray,
                red,
                brown: blue,
                green,
                pink,
                orange,
              }[entry.indicator?.color]
            }
            variant="subtle"
            mr="12px"
            display="flex"
            alignItems={"center"}
            style={{ borderRadius: "0.25rem", padding: "0 0.5rem" }}
          >
            {entry.indicator?.name}
          </Badge>
        )}
        <Icon icon={"ri:arrow-right-s-line"} height={"24px"} />
      </Flex>
    </Flex>
  );
};
