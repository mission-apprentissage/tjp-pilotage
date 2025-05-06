"use client";

import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
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
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import {PermissionEnum} from 'shared/enum/permissionEnum';

import { client } from "@/api.client";
import { CreateCampagneRegion } from "@/app/(wrapped)/admin/campagnes/components/CreateCampagneRegion";
import { DeleteCampagneRegion } from "@/app/(wrapped)/admin/campagnes/components/DeleteCampagneRegion";
import { EditCampagneRegion } from "@/app/(wrapped)/admin/campagnes/components/EditCampagneRegion";
import { CampagneStatutTag } from "@/components/CampagneStatutTag";
import {formatBoolean, formatDate} from '@/utils/formatUtils';
import { GuardPermission } from "@/utils/security/GuardPermission";
import { useCurrentCampagne } from "@/utils/security/useCurrentCampagne";

const Page = () => {

  const { campagne: currentCampagne } = useCurrentCampagne();
  const { data: campagnesRegion } = client.ref("[GET]/campagnes-region").useQuery({});
  const { data: campagnes } = client.ref("[GET]/campagnes").useQuery({});
  const { data: regions } = client.ref("[GET]/regions").useQuery({});
  const { data: latestCampagne } = client.ref("[GET]/campagne/latest").useQuery({});

  const [campagneRegionId, setCampagneRegionId] = useState<string>();
  const campagneRegion = useMemo(() =>
    campagnesRegion?.find(({ id }) => id === campagneRegionId), [campagnesRegion, campagneRegionId]
  );
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

  const hasCampagneEnCours = campagnesRegion?.some(
    (campagneRegion) => campagneRegion.id === currentCampagne?.campagneRegionId
  );

  return (
    <GuardPermission permission={PermissionEnum["campagnes-région/lecture"]}>
      <Flex px={4} py="2" justify={"end"}>
        <Tooltip
          label={hasCampagneEnCours ?
            "Une campagne régionale existe déjà pour votre région. Vous pouvez uniquement modifier la campagne existante." :
            undefined
          }
          shouldWrapChildren
          placement="bottom-start"
        >
          <Button
            variant="primary"
            ml="auto"
            leftIcon={<AddIcon />}
            onClick={() => {
              setCampagneRegionId(undefined);
              onOpenEdit();
            }}
            isDisabled={hasCampagneEnCours}
          >
            Ajouter une campagne régionale
          </Button>
        </Tooltip>
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
                  <Th width={"10%"}>Saisie perdir ?</Th>
                  <Th width={"10%"}>Date du vote CR</Th>
                  <Th width={"10%"}>Date de début</Th>
                  <Th width={"10%"}>Date de fin</Th>
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
                      {formatBoolean(campagneRegion.withSaisiePerdir)}
                    </Td>
                    <Td width={"10%"}>
                      {formatDate({date: campagneRegion.dateVote, options: { dateStyle: "short" }, nullValue: "Non définie"})}
                    </Td>
                    <Td width={"10%"}>
                      {formatDate({date: campagneRegion.dateDebut, options: { dateStyle: "short" }, nullValue: "Non définie"})}
                    </Td>
                    <Td width={"10%"}>
                      {formatDate({date: campagneRegion.dateFin, options: { dateStyle: "short" }, nullValue: "Non définie"})}
                    </Td>
                    <Td width={"5%"} isNumeric>
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
                            onOpenEdit();
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
                            onOpenDelete();
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
        )
      }
      {campagnes && campagnes.length > 0 && (
        <>
          {campagneRegion && isOpenEdit && (
            <EditCampagneRegion
              isOpen={isOpenEdit}
              onClose={onCloseEdit}
              campagneRegion={campagneRegion}
              campagnes={campagnes}
              regions={regions}
            />
          )}
          {campagneRegion && isOpenDelete && (
            <DeleteCampagneRegion
              isOpen={isOpenDelete}
              onClose={onCloseDelete}
              campagneRegion={campagneRegion}
              regions={regions}
            />
          )}
          {!campagneRegion && isOpenEdit && (
            <CreateCampagneRegion
              isOpen={isOpenEdit}
              onClose={onCloseEdit}
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
export default Page;
