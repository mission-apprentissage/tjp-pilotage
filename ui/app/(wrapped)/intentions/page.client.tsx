"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import NextLink from "next/link";

import { api } from "../../../api.client";

export const PageClient = () => {
  const { data, isLoading } = useQuery({
    queryKey: [],
    queryFn: api.getDemandes({}).call,
  });
  return (
    <Box flex={1} overflow="auto">
      <Container pt="4" maxW="container.xl">
        <Flex align="baseline">
          <Heading>Intentions</Heading>
          <Button
            ml="auto"
            variant="primary"
            as={NextLink}
            href="/intentions/new"
          >
            Nouvelle demande
          </Button>
        </Flex>

        <TableContainer my="10">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>id</Th>
                <Th>createdAt</Th>
                <Th isNumeric>status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.map((demande) => (
                <Tr key={demande.id}>
                  <Td>
                    <Link as={NextLink} href={`/intentions/${demande.id}`}>
                      {demande.id}
                    </Link>
                  </Td>
                  <Td>{demande.createdAt}</Td>
                  <Td isNumeric>{demande.status}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};
