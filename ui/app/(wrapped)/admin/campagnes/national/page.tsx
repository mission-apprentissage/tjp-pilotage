"use client";

import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Flex,
  Heading,
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
import { CreateCampagne } from "@/app/(wrapped)/admin/campagnes/components/CreateCampagne";
import { CreateCampagneRegion } from "@/app/(wrapped)/admin/campagnes/components/CreateCampagneRegion";
import { EditCampagne } from "@/app/(wrapped)/admin/campagnes/components/EditCampagne";
import { EditCampagneRegion } from "@/app/(wrapped)/admin/campagnes/components/EditCampagneRegion";
import { CampagneStatutTag } from "@/components/CampagneStatutTag";
import { GuardPermission } from "@/utils/security/GuardPermission";

// eslint-disable-next-line react/display-name, import/no-anonymous-default-export
export default () => {
  const { data: campagnes } = client.ref("[GET]/campagnes").useQuery({});
  const { data: campagnesRegion } = client.ref("[GET]/campagnes-region").useQuery({});
  const { data: regions } = client.ref("[GET]/regions").useQuery({});

  const [campagneId, setCampagneId] = useState<string>();
  const [campagneRegionId, setCampagneRegionId] = useState<string>();
  const campagne = useMemo(() => campagnes?.find(({ id }) => id === campagneId), [campagnes, campagneId]);
  const campagneRegion = useMemo(() => campagnesRegion?.find(({ id }) => id === campagneRegionId),
    [campagnesRegion, campagneRegionId]
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenCampagneRegion,
    onOpen: onOpenCampagneRegion,
    onClose: onCloseCampagneRegion
  } = useDisclosure();

  return (
    <GuardPermission permission="campagnes/lecture">
      <Flex direction="column" p={4} gap={5}>
        <Flex py="2" justifyContent={"space-between"}>
          <Heading as="h2" fontSize={18} color="bluefrance.113">Campagnes nationales</Heading>
          <Button
            variant="primary"
            ml="auto"
            leftIcon={<AddIcon />}
            onClick={() => {
              setCampagneId(undefined);
              onOpen();
            }}
          >
            Ajouter une campagne nationale
          </Button>
        </Flex>
        <TableContainer>
          <Table sx={{ td: { py: "2", px: 4 }, th: { px: 4 } }} size="md" fontSize="14px" gap="0">
            <Thead position="sticky" top="0" boxShadow="0 0 6px 0 rgb(0,0,0,0.15)" bg="white">
              <Tr>
                <Th width={"4rem"}>Id</Th>
                <Th width={"3rem"}>Année</Th>
                <Th>Statut</Th>
                <Th width={"3rem"}>Date de début</Th>
                <Th width={"4rem"}>Date de fin</Th>
                <Th width={"4rem"}>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {campagnes?.map((campagne) => (
                <Tr key={campagne.id}>
                  <Td isTruncated>
                    {campagne.id}
                  </Td>
                  <Td>{campagne.annee}</Td>
                  <Td>
                    <CampagneStatutTag statut={campagne.statut} />
                  </Td>
                  <Td>
                    {campagne.dateDebut ? toDate(campagne.dateDebut).toLocaleDateString("fr-FR") : "Non définie"}
                  </Td>
                  <Td>
                    {campagne.dateFin ? toDate(campagne.dateFin).toLocaleDateString("fr-FR") : "Non définie"}
                  </Td>
                  <Td>
                    <IconButton
                      position="unset"
                      variant="ghost"
                      onClick={() => {
                        setCampagneId(campagne.id);
                        onOpen();
                      }}
                      aria-label="Éditer"
                    >
                      <EditIcon />
                    </IconButton>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Divider />
        <Flex py="2" justifyContent={"space-between"}>
          <Heading as="h2" fontSize={18} color="bluefrance.113">Campagnes régionales</Heading>
          <Button
            variant="primary"
            ml="auto"
            leftIcon={<AddIcon />}
            onClick={() => {
              setCampagneRegionId(undefined);
              onOpenCampagneRegion();
            }}
          >
            Ajouter une campagne régionale
          </Button>
        </Flex>
        <TableContainer >
          <Table sx={{ td: { py: "2", px: 4 }, th: { px: 4 } }} size="md" fontSize="14px" gap="0">
            <Thead position="sticky" top="0" boxShadow="0 0 6px 0 rgb(0,0,0,0.15)" bg="white">
              <Tr>
                <Th width={"4rem"}>Id</Th>
                <Th width={"3rem"}>Année</Th>
                <Th width={"3rem"}>Statut</Th>
                <Th>Région</Th>
                <Th width={"3rem"}>Date de début</Th>
                <Th width={"4rem"}>Date de fin</Th>
              </Tr>
            </Thead>
            <Tbody>
              {campagnesRegion?.map((campagneRegion) => (
                <Tr key={campagneRegion.id}>
                  <Td isTruncated>
                    {campagneRegion.id}
                  </Td>
                  <Td>{campagneRegion.annee}</Td>
                  <Td>
                    <CampagneStatutTag statut={campagneRegion.statut} />
                  </Td>
                  <Td>{campagneRegion.region}</Td>
                  <Td>
                    {campagneRegion.dateDebut ? toDate(campagneRegion.dateDebut).toLocaleDateString("fr-FR") : "Non définie"}
                  </Td>
                  <Td>
                    {campagneRegion.dateFin ? toDate(campagneRegion.dateFin).toLocaleDateString("fr-FR") : "Non définie"}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
      {campagne && isOpen && <EditCampagne isOpen={isOpen} onClose={onClose} campagne={campagne} />}
      {!campagne && isOpen && <CreateCampagne isOpen={isOpen} onClose={onClose} />}
      {campagnes && campagnes.length > 0 && (
        <>
          {campagneRegion && isOpenCampagneRegion && (
            <EditCampagneRegion
              isOpen={isOpenCampagneRegion}
              onClose={onCloseCampagneRegion}
              campagneRegion={campagneRegion}
              campagnes={campagnes}
              regions={regions}
            />
          )}
          {!campagneRegion && isOpenCampagneRegion && (
            <CreateCampagneRegion
              isOpen={isOpenCampagneRegion}
              onClose={onCloseCampagneRegion}
              campagnes={campagnes}
              regions={regions}
            />
          )}
        </>
      )}
    </GuardPermission>
  );
};
