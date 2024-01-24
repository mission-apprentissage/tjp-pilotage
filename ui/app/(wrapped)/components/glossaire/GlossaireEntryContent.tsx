import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Box,
  Flex,
  Heading,
  ListItem,
  SkeletonCircle,
  SkeletonText,
  UnorderedList,
  useToken,
} from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import ReactMarkdown, { Components } from "react-markdown";

import { client } from "@/api.client";

import { GlossaireIcon } from "./GlossaireIcon";

const chakraRendererTheme: Components = {
  ul: ({ children }) => <UnorderedList mb={"24px"}>{children}</UnorderedList>,
  li: ({ children }) => <ListItem>{children}</ListItem>,
  blockquote: ({ children }) => (
    <blockquote
      style={{
        borderLeft: "4px solid #6a6af4",
        padding: "16px 32px",
        marginBottom: "24px",
        backgroundColor: "#F6F6F6",
      }}
    >
      {children}
    </blockquote>
  ),
};

const RenderGlossaireEntrySkeleton = () => {
  return (
    <Flex direction={"column"}>
      <Flex
        direction="row"
        wrap={"nowrap"}
        width={"100%"}
        alignItems={"center"}
        gap={3}
      >
        <SkeletonCircle height="32px" width={"32px"} />
        <SkeletonText noOfLines={1} skeletonHeight="32px" width="100%" />
      </Flex>
      <SkeletonText mt="32px" noOfLines={3} spacing="4" skeletonHeight="20" />
    </Flex>
  );
};

const useGlossaireEntryContentHook = (id: string) => {
  const { data, isLoading, isError, error } = client
    .ref("[GET]/glossaire/:id")
    .useQuery(
      {
        params: {
          id,
        },
      },
      {
        keepPreviousData: true,
        staleTime: 10000000,
      }
    );

  return {
    isLoading,
    isError,
    error,
    entry: data,
  };
};

export const GlossaireEntryContent = ({ id }: { id: string }) => {
  const [blue, yellow, purple, gray, red, green, pink, orange] = useToken(
    "colors",
    ["blue", "yellow", "purple", "gray", "red", "green", "pink", "orange"]
  );
  const { entry, isLoading, isError, error } = useGlossaireEntryContentHook(id);

  if (isLoading) {
    return <RenderGlossaireEntrySkeleton />;
  }

  if (isError) {
    console.error(error);
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertDescription>
          Une erreur est survenue lors de la récupération du contenu de l'entrée
          du glossaire
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Box margin={"0px 12px"}>
      <Flex
        direction="row"
        justifyContent={"space-between"}
        alignItems={"center"}
        marginBottom={"24px"}
      >
        <Flex direction="row" justifyContent={"start"} alignItems={"center"}>
          {entry?.icon && (
            <GlossaireIcon icon={entry.icon} size="32px" marginRight="8px" />
          )}
          {entry?.title && (
            <Heading as="h6" size="lg" color="bluefrance.113">
              {entry?.title}
            </Heading>
          )}
        </Flex>
        {entry?.indicator && (
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
              }[entry.indicator?.color ?? "blue"]
            }
            variant="subtle"
            display="flex"
            alignItems={"center"}
            style={{ borderRadius: "0.25rem", padding: "0.25rem 0.5rem" }}
          >
            {entry.indicator?.name}
          </Badge>
        )}
      </Flex>
      <ReactMarkdown
        components={ChakraUIRenderer(chakraRendererTheme)}
        className={"react-markdown"}
        skipHtml
      >
        {entry?.content ?? ""}
      </ReactMarkdown>
    </Box>
  );
};
