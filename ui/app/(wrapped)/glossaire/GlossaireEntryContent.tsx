import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Flex,
  Heading,
  Img,
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
import { TypeBadge } from "./TypeBadge";

function isGlossaireId(href?: string): boolean {
  try {
    new URL(href ?? "");
    return false;
  } catch (_error) {
    console.error("Invalid URL", _error);
    return true;
  }
}

const chakraRendererTheme: Components = {
  ul: ({ children }) => <UnorderedList mb={"24px"}>{children}</UnorderedList>,
  li: ({ children }) => <ListItem>{children}</ListItem>,
  img: ({ src, alt }) => {
    // Assurez-vous que le chemin commence par un slash
    const imagePath = src?.startsWith('/') ? src : `/${src}`;
    return <Img src={imagePath} alt={alt ?? ''} />;
  },
  blockquote: ({ children }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const greyColor = useToken("colors", "grey.975");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const blueColor = useToken("colors", "bluefrance.525");
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
    console.log(`Is glossaire id: ${isGlossaireId(href)}`);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { setSelectedEntry } = useGlossaireContext();
    if (isGlossaireId(href)) {
      return (
        <Link
          onClick={() => setSelectedEntry(href)}
          color="bluefrance.113"
          textDecor={"underline"}
        >
          {children}
        </Link>
      );
    }

    return (
      <Link href={href} color="bluefrance.113" textDecor={"underline"} target="_blank">
        {children}
      </Link>
    );
  },
  aside: ({ children }) => {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const greyColor = useToken("colors", "grey.975");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const blueColor = useToken("colors", "bluefrance.525");

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
        <Heading as="h6" size="md" color="black">A noter</Heading>
        {children}
      </blockquote>
    );
  }
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

const useGlossaireEntryContentHook = (slug: string) => {
  const trackEvent = usePlausible();

  const { data, isLoading, isError, error } = client.ref("[GET]/glossaire/:slug").useQuery(
    {
      params: {
        slug,
      },
    },
    {
      keepPreviousData: true,
      staleTime: 10000000,
    }
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
          {entry?.icon && <GlossaireIcon icon={entry.icon} size="32px" marginRight="8px" color="bluefrance.113" />}
          {entry?.title && (
            <Heading as="h6" size="lg" color="bluefrance.113">
              {entry?.title}
            </Heading>
          )}
        </Flex>
        {entry?.type && <TypeBadge type={entry.type} />}
      </Flex>
      <ReactMarkdown components={ChakraUIRenderer(chakraRendererTheme)} className={"react-markdown"}>
        {entry?.content ?? ""}
      </ReactMarkdown>
    </Box>
  );
};
