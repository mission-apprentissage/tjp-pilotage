import { Grid, GridItem, HStack, Skeleton, SkeletonText, VStack } from "@chakra-ui/react";

// This is to ensure each react list element has a unique ID
export const EntryLoader = () => {
  return (
    <Grid width="100%" templateColumns="20% 1fr">
      <GridItem>
        <Skeleton height="16px" width="50%" />
      </GridItem>
      <GridItem>
        <VStack flexGrow={1} alignItems="start">
          <HStack fontSize={14} fontWeight="400">
            <Skeleton height="14px" width="100px" />
          </HStack>
          <SkeletonText noOfLines={2} width="100%" />
        </VStack>
      </GridItem>
    </Grid>
  );
};
