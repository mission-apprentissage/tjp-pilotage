import {
  Box,
  Heading,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { client } from "@/api.client";
import { formatAnneeCommuneLibelle } from "@/app/(wrapped)/utils/formatLibelle";

const Loader = () => (
  <TableContainer overflowY={"auto"} flex={1} position="relative" height={"sm"}>
    <Table variant="striped" size={"sm"}>
      <Tbody>
        {new Array(7).fill(0).map((_, i) => (
          <Tr key={i} bg={"grey.975"}>
            <Td>
              <Skeleton opacity={0.3} height="16px" width={"100%"} />
            </Td>
            <Td width={"10%"}>
              <Skeleton opacity={0.3} height="16px" width={"100%"} />
            </Td>
            <Td isNumeric width={"10%"}>
              <Skeleton opacity={0.3} height="16px" width={"100%"} />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </TableContainer>
);

export const FormationsSection = ({
  formations,
  isLoading,
  rentreeScolaire,
}: {
  formations?: (typeof client.infer)["[GET]/panorama/stats/etablissement/:uai"]["formations"];
  isLoading: boolean;
  rentreeScolaire?: string;
}) => {
  return (
    <Box as="section" py="6" mt="6" mb="4" maxWidth={"container.xl"}>
      <Box>
        <Box pl={[null, null, "8"]} maxW={400} mb="8">
          <Heading fontWeight={"hairline"} as="h2">
            Toutes les formations de votre établissement
          </Heading>
          <Text fontSize="sm" color="grey" mt="2">
            Rentrée scolaire {rentreeScolaire ?? "-"}
          </Text>
        </Box>

        {isLoading ? (
          <Loader />
        ) : (
          <TableContainer px={[null, null, "8"]}>
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
                  <Tr key={`${formation.cfd}_${formation.codeDispositif}`}>
                    <Td>{formatAnneeCommuneLibelle(formation)}</Td>
                    <Td>{formation.libelleNiveauDiplome}</Td>
                    <Td isNumeric>{formation.effectif}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};
