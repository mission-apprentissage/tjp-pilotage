import {
  Box,
  Container,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { ApiType } from "shared";

import { api } from "../../../../api.client";

export const FormationsSection = ({
  formations,
  rentreeScolaire,
}: {
  formations?: ApiType<typeof api.getEtablissement>["formations"];
  rentreeScolaire?: string;
}) => {
  return (
    <Container as="section" py="6" mt="6" mb="4" maxWidth={"container.xl"}>
      <Box>
        <Box pl="8" maxW={400} mb="8">
          <Heading fontWeight={"hairline"} as="h2">
            Toutes les formations de votre établissement
          </Heading>
          <Text fontSize="sm" color="grey" mt="2">
            Rentrée scolaire {rentreeScolaire ?? "-"}
          </Text>
        </Box>

        <TableContainer px="8">
          <Table variant="striped" size="sm">
            <Thead>
              <Tr>
                <Th>Formation</Th>
                <Th>Diplôme</Th>
                <Th isNumeric>Effectif</Th>
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
