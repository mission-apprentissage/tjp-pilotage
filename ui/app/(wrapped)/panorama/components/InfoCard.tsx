import { ChevronDownIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Img,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";

export const InfoCard = ({
  title,
  description,
  links,
  img,
  sourceText,
  linkTracker,
}: {
  title: string;
  description: string;
  links: { label?: string; href: string } | { label?: string; href: string }[];
  img: string;
  sourceText?: string;
  linkTracker: (filterName: string) => () => void;
}) => {
  return (
    <Card bg="grey.1000" padding={"1rem"}>
      <CardBody>
        <Flex direction={"column"} justify={"space-between"} height={"100%"}>
          <Flex align="center">
            <Flex direction="column" align="flex-start" mr="4" flex={1} height="100%">
              <Heading as="h4" fontSize={20}>
                {title}
              </Heading>
              <Text flex={1} mt={2}>
                {description}
              </Text>
              {Array.isArray(links) && (
                <Menu>
                  <MenuButton mt={4} as={Button} variant="primary" rightIcon={<ChevronDownIcon />}>
                    Accéder à l'information
                  </MenuButton>
                  <MenuList>
                    {links.map(({ href, label }) => (
                      <MenuItem
                        _hover={{ textDecoration: "none" }}
                        as={Link}
                        href={href}
                        key={href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={linkTracker(title)}
                      >
                        {label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              )}
            </Flex>
            <Img width={["70px", null, "160px"]} src={img} objectFit="contain" />
          </Flex>
          <Flex direction={"row"} justify={"space-between"} mt={"auto"}>
            {!Array.isArray(links) && (
              <Button
                mt={4}
                _hover={{ textDecoration: "none" }}
                variant="primary"
                as={Link}
                href={links.href}
                target="_blank"
                rel="noreferrer"
                rightIcon={<ExternalLinkIcon />}
                onClick={linkTracker(title)}
              >
                Voir le site
              </Button>
            )}
            {sourceText && (
              <Text mt="auto" fontSize="xs" color="grey">
                {sourceText}
              </Text>
            )}
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};
