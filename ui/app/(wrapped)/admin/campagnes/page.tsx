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
import { CampagneStatutTag } from "@/components/CampagneStatutTag";
import { GuardPermission } from "@/utils/security/GuardPermission";

import { CreateCampagne } from "./CreateCampagne";
import { EditCampagne } from "./EditCampagne";

// eslint-disable-next-line react/display-name, import/no-anonymous-default-export
export default () => {
  const { data: campagnes } = client.ref("[GET]/campagnes").useQuery({});

  const [campagneId, setCampagneId] = useState<string>();
  // @ts-expect-error TODO
  const campagne = useMemo(() => campagnes?.find(({ id }) => id === campagneId), [campagnes, campagneId]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <GuardPermission permission="campagnes/lecture">
      <Flex px={4} py="2">
        <Button
          variant="primary"
          ml="auto"
          leftIcon={<AddIcon />}
          onClick={() => {
            setCampagneId(undefined);
            onOpen();
          }}
        >
          Ajouter une campagne
        </Button>
      </Flex>
      <TableContainer overflowY="auto" flex={1}>
        <Table sx={{ td: { py: "2", px: 4 }, th: { px: 4 } }} size="md" fontSize="14px" gap="0">
          <Thead position="sticky" top="0" boxShadow="0 0 6px 0 rgb(0,0,0,0.15)" bg="white">
            <Tr>
              <Th width={"10%"}>Id</Th>
              <Th>Année</Th>
              <Th textAlign={"center"}>Statut</Th>
              <Th width={"10%"}>Date de début</Th>
              <Th width={"10%"}>Date de fin</Th>
              <Th width={"5%"} isNumeric>
                Actions
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {campagnes?.map(
              // @ts-expect-error TODO
              (campagne) => (
                <Tr key={campagne.id}>
                  <Td width={"10%"} isTruncated>
                    {campagne.id}
                  </Td>
                  <Td>{campagne.annee}</Td>
                  <Td textAlign={"center"}>
                    <CampagneStatutTag statut={campagne.statut} />
                  </Td>
                  <Td width={"10%"}>
                    {campagne.dateDebut ? toDate(campagne.dateDebut).toLocaleDateString("fr-FR") : "Non définie"}
                  </Td>
                  <Td width={"10%"}>
                    {campagne.dateFin ? toDate(campagne.dateFin).toLocaleDateString("fr-FR") : "Non définie"}
                  </Td>
                  <Td width={"5%"} isNumeric>
                    <IconButton
                      position="unset"
                      variant="ghost"
                      onClick={() => {
                        setCampagneId(campagne.id);
                        onOpen();
                      }}
                      aria-label="editer"
                    >
                      <EditIcon />
                    </IconButton>
                  </Td>
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      </TableContainer>
      {campagne && isOpen && <EditCampagne isOpen={isOpen} onClose={onClose} campagne={campagne} />}
      {!campagne && isOpen && <CreateCampagne isOpen={isOpen} onClose={onClose} />}
    </GuardPermission>
  );
};
