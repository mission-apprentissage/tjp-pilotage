import { Box, Heading, Link, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import NextLink from "next/link";

import { themeDefinition } from "../../../theme/theme";

interface CardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  link: string;
  linkHref: string;
}

export default function Card({
  children,
  icon,
  link,
  title,
  linkHref,
}: CardProps) {
  return (
    <VStack spacing="8px" alignItems="start" maxWidth="400px" padding="24px">
      <Box
        width="64px"
        height="64px"
        borderRadius="120px"
        backgroundColor="#F5F5FE"
      >
        {icon}
      </Box>
      <Heading as="h3" color="#000091" fontSize="20px" fontWeight={700}>
        {title}
      </Heading>
      {children}
      <Link
        as={NextLink}
        href={linkHref}
        display="flex"
        alignItems="center"
        color={themeDefinition.colors.bluefrance[113]}
        fontWeight={500}
      >
        <span>{link}</span>
        <Box paddingLeft="8px">
          <Icon icon="ri:arrow-right-line" fontSize="16px" />
        </Box>
      </Link>
    </VStack>
  );
}
