"use client";

import {AddIcon, DeleteIcon,EditIcon} from '@chakra-ui/icons';
import {Button, Divider, Flex, Heading, IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip,Tr, useDisclosure} from '@chakra-ui/react';
import { useMemo, useState } from "react";
import {PermissionEnum} from 'shared/enum/permissionEnum';

import { client } from "@/api.client";
import { CreateCampagne } from "@/app/(wrapped)/admin/campagnes/components/CreateCampagne";
import { CreateCampagneRegion } from "@/app/(wrapped)/admin/campagnes/components/CreateCampagneRegion";
import { DeleteCampagneRegion } from '@/app/(wrapped)/admin/campagnes/components/DeleteCampagneRegion';
import { EditCampagne } from "@/app/(wrapped)/admin/campagnes/components/EditCampagne";
import { EditCampagneRegion } from "@/app/(wrapped)/admin/campagnes/components/EditCampagneRegion";
import { CampagneStatutTag } from "@/components/CampagneStatutTag";
import {formatBoolean, formatDate} from '@/utils/formatUtils';
import { GuardPermission } from "@/utils/security/GuardPermission";

// eslint-disable-next-line react/display-name, import/no-anonymous-default-export
export default () => {
  const { data: campagnes } = client.ref("[GET]/campagnes").useQuery({});
  const { data: campagnesRegion } = client.ref("[GET]/campagnes-region").useQuery({});
  const { data: regions } = client.ref("[GET]/regions").useQuery({});
  const { data: latestCampagne } = client.ref("[GET]/campagne/latest").useQuery({});

  const [campagneId, setCampagneId] = useState<string>();
  const [campagneRegionId, setCampagneRegionId] = useState<string>();
  const campagne = useMemo(() => campagnes?.find(({ id }) => id === campagneId), [campagnes, campagneId]);
  const campagneRegion = useMemo(() => campagnesRegion?.find(({ id }) => id === campagneRegionId),
    [campagnesRegion, campagneRegionId]
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenEditCampagneRegion,
    onOpen: onOpenEditCampagneRegion,
    onClose: onCloseEditCampagneRegion
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteCampagneRegion,
    onOpen: onOpenDeleteCampagneRegion,
    onClose: onCloseDeleteCampagneRegion
  } = useDisclosure();

  return (
    <GuardPermission permission={PermissionEnum["campagnes/lecture"]}>
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
                    {formatDate({date: campagne.dateDebut, options: { dateStyle: "short" }, nullValue: "Non définie"})}
                  </Td>
                  <Td>
                    {formatDate({date: campagne.dateFin, options: { dateStyle: "short" }, nullValue: "Non définie"})}
                  </Td>
                  <Td>
                    <Tooltip
                      label="Éditer la campagne nationale"
                      placement="bottom-start"
                      shouldWrapChildren
                    >
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
                    </Tooltip>
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
              onOpenEditCampagneRegion();
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
                <Th width={"6rem"}>Région</Th>
                <Th width={"3rem"}>Saisie perdir ?</Th>
                <Th>Date de vote</Th>
                <Th width={"3rem"}>Date de début</Th>
                <Th width={"4rem"}>Date de fin</Th>
                <Th width={"4rem"}>Actions</Th>
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
                    {formatBoolean(campagneRegion.withSaisiePerdir)}
                  </Td>
                  <Td>
                    {formatDate({date: campagneRegion.dateVote, options: { dateStyle: "short" }, nullValue: "Non définie"})}
                  </Td>
                  <Td>
                    {formatDate({date: campagneRegion.dateDebut, options: { dateStyle: "short" }, nullValue: "Non définie"})}
                  </Td>
                  <Td>
                    {formatDate({date: campagneRegion.dateFin, options: { dateStyle: "short" }, nullValue: "Non définie"})}
                  </Td>
                  <Td>
                    <Tooltip
                      label="Éditer la campagne régionale"
                      placement="bottom-start"
                      shouldWrapChildren
                    >
                      <IconButton
                        position="unset"
                        variant="ghost"
                        onClick={() => {
                          setCampagneRegionId(campagneRegion.id);
                          onOpenEditCampagneRegion();
                        }}
                        aria-label={`Éditer la campagne régionale ${campagneRegion.id}`}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      label="Supprimer la campagne régionale"
                      placement="bottom-start"
                      shouldWrapChildren
                    >
                      <IconButton
                        position="unset"
                        variant="ghost"
                        onClick={() => {
                          setCampagneRegionId(campagneRegion.id);
                          onOpenDeleteCampagneRegion();
                        }}
                        aria-label={`Supprimer la campagne régionale ${campagneRegion.id}`}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
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
          {campagneRegion && isOpenEditCampagneRegion && (
            <EditCampagneRegion
              isOpen={isOpenEditCampagneRegion}
              onClose={onCloseEditCampagneRegion}
              campagneRegion={campagneRegion}
              campagnes={campagnes}
              regions={regions}
            />
          )}
          {campagneRegion && isOpenDeleteCampagneRegion && (
            <DeleteCampagneRegion
              isOpen={isOpenDeleteCampagneRegion}
              onClose={onCloseDeleteCampagneRegion}
              campagneRegion={campagneRegion}
              regions={regions}
            />
          )}
          {!campagneRegion && isOpenEditCampagneRegion && (
            <CreateCampagneRegion
              isOpen={isOpenEditCampagneRegion}
              onClose={onCloseEditCampagneRegion}
              regions={regions}
              campagnes={campagnes}
              latestCampagne={latestCampagne}
            />
          )}
        </>
      )}
    </GuardPermission>
  );
};
