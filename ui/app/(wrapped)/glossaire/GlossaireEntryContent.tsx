import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Box,
  Flex,
  Heading,
  Link,
  ListItem,
  SkeletonCircle,
  SkeletonText,
  UnorderedList,
  useToken,
} from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { usePlausible } from "next-plausible";
import { useEffect } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";

import { client } from "@/api.client";

import { useGlossaireContext } from "./glossaireContext";
import { GlossaireIcon } from "./GlossaireIcon";

const notionIdHrefRegex = /^\/?[0-9a-zA-Z]{32}$/;

function isNotionId(href?: string): boolean {
  return notionIdHrefRegex.test(href ?? "");
}

function convertToNotionPageId(id: string | undefined): string {
  return (id ?? "").replace("/", "").replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");
}

const chakraRendererTheme: Components = {
  ul: ({ children }) => <UnorderedList mb={"24px"}>{children}</UnorderedList>,
  li: ({ children }) => <ListItem>{children}</ListItem>,
  blockquote: ({ children }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const greyColor = useToken("colors", "grey.975"); // TODO
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const blueColor = useToken("colors", "bluefrance.525"); // TODO
    return (
      <blockquote
        style={{
          borderLeft: "4px solid",
          borderColor: blueColor,
          padding: "16px 32px",
          marginBottom: "24px",
          backgroundColor: greyColor,
        }}
      >
        {children}
      </blockquote>
    );
  },
  a: ({ children, href }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { setSelectedEntry } = useGlossaireContext(); // TODO
    if (isNotionId(href)) {
      return (
        <Link
          onClick={() => setSelectedEntry(convertToNotionPageId(href))}
          color="bluefrance.113"
          textDecor={"underline"}
        >
          {children}
        </Link>
      );
    }

    return (
      <Link href={href} color="bluefrance.113" textDecor={"underline"}>
        {children}
      </Link>
    );
  },
};

const RenderGlossaireEntrySkeleton = () => {
  return (
    <Flex direction={"column"}>
      <Flex direction="row" wrap={"nowrap"} width={"100%"} alignItems={"center"} gap={3}>
        <SkeletonCircle height="32px" width={"32px"} />
        <SkeletonText noOfLines={1} skeletonHeight="32px" width="100%" />
      </Flex>
      <SkeletonText mt="32px" noOfLines={3} spacing="4" skeletonHeight="20" />
    </Flex>
  );
};

const useGlossaireEntryContentHook = (id: string) => {
  const trackEvent = usePlausible();

  const { data, isLoading, isError, error } = client.ref("[GET]/glossaire/:id").useQuery(
    {
      params: {
        id,
      },
    },
    {
      keepPreviousData: true,
      staleTime: 10000000,
    },
  );

  useEffect(() => {
    if (data) {
      trackEvent("glossaire", { props: { name: data.title } });
    }
  }, [data, trackEvent]);

  return {
    isLoading,
    isError,
    error,
    entry: data,
  };
};

export const GlossaireEntryContent = ({ id }: { id: string }) => {
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
          Une erreur est survenue lors de la récupération du contenu de l'entrée du glossaire
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Box margin={"0px 12px"}>
      <Flex direction="row" justifyContent={"space-between"} alignItems={"center"} marginBottom={"24px"}>
        <Flex direction="row" justifyContent={"start"} alignItems={"center"}>
          {entry?.icon && <GlossaireIcon icon={entry.icon} size="32px" marginRight="8px" />}
          {entry?.title && (
            <Heading as="h6" size="lg" color="bluefrance.113">
              {entry?.title}
            </Heading>
          )}
        </Flex>
        {entry?.indicator && (
          <Badge
            variant={
              {
                green: "success",
                blue: "info",
                yellow: "new",
                red: "error",
                orange: "warning",
                purple: "purpleGlycine",
                pink: "pinkTuile",
                brown: "brownCafeCreme",
              }[entry.indicator?.color]
            }
            display="flex"
            alignItems={"center"}
            style={{ borderRadius: "0.25rem", padding: "0.25rem 0.5rem" }}
          >
            {entry.indicator?.name}
          </Badge>
        )}
      </Flex>
      <ReactMarkdown components={ChakraUIRenderer(chakraRendererTheme)} className={"react-markdown"} skipHtml>
        {entry?.content ?? ""}
      </ReactMarkdown>
    </Box>
  );
};
