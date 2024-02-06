import { Grid, GridItem, HStack, Tag, Text, VStack } from "@chakra-ui/react";

import { themeDefinition } from "../../../../theme/theme";
import { ChangelogEntry } from "../changelogContext";

interface EntryProps {
  changelogEntry: ChangelogEntry;
}

// This is to ensure each react list element has a unique ID
let entry = 0;

const mois = [
  "Jan.",
  "Fev.",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juil.",
  "Aout",
  "Sept.",
  "Oct.",
  "Nov.",
  "Dec.",
];
const generateDateString = (str: string) => {
  const date = new Date(str);
  const day = date.getDate();
  const month = mois[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

export const Entry = ({ changelogEntry }: EntryProps) => {
  entry++;
  return (
    <Grid width="100%" templateColumns="20% 1fr">
      <GridItem>
        <HStack alignItems="start">
          <Text paddingRight="6px">🚧</Text>
          <Text as="h2" fontWeight={700} fontSize="16px">
            {changelogEntry.title}
          </Text>
        </HStack>
      </GridItem>
      <GridItem>
        <VStack flexGrow={1} alignItems="start">
          <HStack fontSize="14px" fontWeight="400">
            {changelogEntry.types.map((type, i) => (
              <Tag
                key={`${entry}-${type}-${i}`}
                backgroundColor={
                  type.label === "Données"
                    ? themeDefinition.colors.orange.draft
                    : themeDefinition.colors.info[950]
                }
                color={
                  type.label === "Données"
                    ? themeDefinition.colors.orange.dark
                    : themeDefinition.colors.info[525]
                }
              >
                {type.label.toUpperCase()}
              </Tag>
            ))}
            <Text color={themeDefinition.colors.grey["425_hover"]}>
              {changelogEntry.date.type === "string" &&
                changelogEntry.date.value}
              {changelogEntry.date.type === "date" &&
                generateDateString(changelogEntry.date.value)}
            </Text>
          </HStack>
          <Text fontSize="16px" fontWeight={400}>
            {changelogEntry.description}
          </Text>
        </VStack>
      </GridItem>
    </Grid>
  );
};
