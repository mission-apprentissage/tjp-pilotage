"use client";

import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { toDate } from "date-fns";
import { useMemo, useState } from "react";

import { client } from "@/api.client";
import { CreateCampagneRegion } from "@/app/(wrapped)/admin/campagnes/components/CreateCampagneRegion";
import { EditCampagneRegion } from "@/app/(wrapped)/admin/campagnes/components/EditCampagneRegion";
import { CampagneStatutTag } from "@/components/CampagneStatutTag";
import { formatBoolean } from "@/utils/formatUtils";
import { GuardPermission } from "@/utils/security/GuardPermission";

// eslint-disable-next-line react/display-name, import/no-anonymous-default-export
export default () => {
  const { data: campagnesRegion } = client.ref("[GET]/campagnes-region").useQuery({});
  const { data: campagnes } = client.ref("[GET]/campagnes").useQuery({});
  const { data: regions } = client.ref("[GET]/regions").useQuery({});

  const [campagneRegionId, setCampagneRegionId] = useState<string>();
  const campagneRegion = useMemo(() =>
    campagnesRegion?.find(({ id }) => id === campagneRegionId), [campagnesRegion, campagneRegionId]
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <GuardPermission permission="campagnes-région/lecture">
      <Flex px={4} py="2">
        <Button
          variant="primary"
          ml="auto"
          leftIcon={<AddIcon />}
          onClick={() => {
            setCampagneRegionId(undefined);
            onOpen();
          }}
        >
          Ajouter une campagne régionale
        </Button>
      </Flex>
      {
        campagnesRegion && (
          <TableContainer overflowY="auto" flex={1}>
            <Table sx={{ td: { py: "2", px: 4 }, th: { px: 4 } }} size="md" fontSize="14px" gap="0">
              <Thead position="sticky" top="0" boxShadow="0 0 6px 0 rgb(0,0,0,0.15)" bg="white">
                <Tr>
                  <Th width={"10%"}>Id</Th>
                  <Th>Année</Th>
                  <Th>Région</Th>
                  <Th textAlign={"center"}>Statut</Th>
                  <Th width={"10%"}>Date de début</Th>
                  <Th width={"10%"}>Date de fin</Th>
                  <Th width={"10%"}>Saisie perdir</Th>
                  <Th width={"5%"} isNumeric>
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {campagnesRegion?.map((campagneRegion) => (
                  <Tr key={campagneRegion.id}>
                    <Td width={"10%"} isTruncated>
                      {campagneRegion.id}
                    </Td>
                    <Td>{campagneRegion.annee}</Td>
                    <Td>{campagneRegion.region}</Td>
                    <Td textAlign={"center"}>
                      <CampagneStatutTag statut={campagneRegion.statut} />
                    </Td>
                    <Td width={"10%"}>
                      {
                        campagneRegion.dateDebut ?
                          toDate(campagneRegion.dateDebut).toLocaleDateString("fr-FR") :
                          "Non définie"
                      }
                    </Td>
                    <Td width={"10%"}>
                      {
                        campagneRegion.dateFin ?
                          toDate(campagneRegion.dateFin).toLocaleDateString("fr-FR") :
                          "Non définie"
                      }
                    </Td>
                    <Td width={"10%"}>
                      {formatBoolean(campagneRegion.withSaisiePerdir)}
                    </Td>
                    <Td width={"5%"} isNumeric>
                      <IconButton
                        position="unset"
                        variant="ghost"
                        onClick={() => {
                          setCampagneRegionId(campagneRegion.id);
                          onOpen();
                        }}
                        aria-label="editer"
                      >
                        <EditIcon />
                      </IconButton>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )
      }
      {campagnes && campagnes.length > 0 && (
        <>
          {campagneRegion && isOpen && (
            <EditCampagneRegion
              isOpen={isOpen}
              onClose={onClose}
              campagneRegion={campagneRegion}
              campagnes={campagnes}
              regions={regions}
            />
          )}
          {!campagneRegion && isOpen && (
            <CreateCampagneRegion isOpen={isOpen} onClose={onClose} campagnes={campagnes} regions={regions}/>
          )}
        </>
      )}
    </GuardPermission>
  );
};
