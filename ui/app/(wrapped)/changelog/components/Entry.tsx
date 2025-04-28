import { Grid, GridItem, HStack, Tag, Text, VStack } from "@chakra-ui/react";

import type { ChangelogTypeType, IChangelog } from "@/app/(wrapped)/changelog/const";
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

const BG_COLOR: Record<ChangelogTypeType, string> = {
  "Fonctionnalité": themeDefinition.colors.info[950],
  "Données": themeDefinition.colors.orange.draft,
  "BANDEAU": themeDefinition.colors.info[950],
  "Bug": themeDefinition.colors.redmarianne[925],
};

const TEXT_COLOR: Record<ChangelogTypeType, string> = {
  "Fonctionnalité": themeDefinition.colors.info[525],
  "Données": themeDefinition.colors.yellowTournesol[407],
  "BANDEAU": themeDefinition.colors.info[525],
  "Bug": themeDefinition.colors.redmarianne[625],
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
                backgroundColor={BG_COLOR[type]}
                color={TEXT_COLOR[type]}
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
