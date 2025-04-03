import { Grid, GridItem, HStack, Tag, Text, VStack } from "@chakra-ui/react";

import type { IChangelog } from "@/app/(wrapped)/changelog/const";
import { themeDefinition } from "@/theme/theme";

interface EntryProps {
  changelogEntry: IChangelog;
}

// This is to ensure each react list element has a unique ID
let entry = 0;

const mois = ["Jan.", "Fev.", "Mars", "Avril", "Mai", "Juin", "Juil.", "Aout", "Sept.", "Oct.", "Nov.", "Dec."];
const generateDateString = (date: Date) => {
  const day = date.getDate();
  const month = mois[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

export const Entry = ({ changelogEntry }: EntryProps) => {
  entry++;
  return (
    <Grid
      width="100%"
      templateColumns={{
        base: "1fr",
        lg: "20% 1fr",
      }}
      templateRows={{
        base: "auto 1fr",
        lg: "1fr",
      }}
    >
      <GridItem>
        <HStack alignItems="start" paddingBottom="16px" paddingRight="16px">
          <Text paddingRight="6px">🚧</Text>
          <Text as="h2" fontWeight={700} fontSize={16}>
            {changelogEntry.title}
          </Text>
        </HStack>
      </GridItem>
      <GridItem>
        <VStack flexGrow={1} alignItems="start">
          <HStack fontSize={14} fontWeight="400">
            {changelogEntry.types.map((type, i) => (
              <Tag
                key={`${entry}-${type}-${i}`}
                backgroundColor={
                  type === "Données" ? themeDefinition.colors.orange.draft : themeDefinition.colors.info[950]
                }
                color={
                  type === "Données"
                    ? themeDefinition.colors.yellowTournesol[407]
                    : themeDefinition.colors.info[525]
                }
              >
                {type.toUpperCase()}
              </Tag>
            ))}
            <Text color={themeDefinition.colors.grey["425_hover"]}>
              {generateDateString(changelogEntry.date)}
            </Text>
          </HStack>
          <Text fontSize={16} fontWeight={400}>
            {changelogEntry.description}
          </Text>
        </VStack>
      </GridItem>
    </Grid>
  );
};
