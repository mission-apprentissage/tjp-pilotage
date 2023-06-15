import {
  Box,
  Container,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { ApiType } from "shared";

import { api } from "../../../../api.client";

export const FormationsSection = ({
  formations,
}: {
  formations?: ApiType<typeof api.getEtablissement>["formations"];
}) => {
  return (
    <Container as="section" py="6" mt="6" maxWidth={"container.xl"}>
      <Box>
        <Heading pl="8" maxW={400} fontWeight={"hairline"} as="h2" mb="8">
          Toutes les formations de votre établissement
        </Heading>
        <TableContainer px="8">
          <Table variant="striped" size="sm">
            <Thead>
              <Tr>
                <Th>Formation</Th>
                <Th>Diplôme</Th>
                <Th isNumeric>Effectifs</Th>
              </Tr>
            </Thead>
            <Tbody>
              {formations?.map((formation) => (
                <Tr key={`${formation.cfd}_${formation.dispositifId}`}>
                  <Td>{formation.libelleDiplome}</Td>
                  <Td>{formation.libelleNiveauDiplome}</Td>
                  <Td isNumeric>{formation.effectif}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};
