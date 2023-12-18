"use client";

import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";

import { EditUser } from "@/app/(wrapped)/users/EditUser";
import { OrderIcon } from "@/components/OrderIcon";
import { TableFooter } from "@/components/TableFooter";
import { useStateParams } from "@/utils/useFilters";

import { client } from "../../../api.client";
import { GuardPermission } from "../../../utils/security/GuardPermission";
import { CreateUser } from "./CreateUser";

export default () => {
  const [filters, setFilters] = useStateParams<{
    page: number;
    search?: string;
    order?: { orderBy: string; order: "asc" | "desc" };
  }>({ defaultValues: { page: 0 } });

  const { data } = client.ref("[GET]/users").useQuery({
    query: { search: filters.search, limit: 30, offset: filters.page * 30 },
  });

  const order = filters.order;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userId, setUserId] = useState<string>();
  const user = useMemo(
    () => data?.users.find(({ id }) => id === userId),
    [data, userId]
  );

  const [search, setSearch] = useState(filters.search);

  return (
    <GuardPermission permission="users/lecture">
      {data?.users && (
        <>
          <Flex px={4} py="2">
            <Box
              as="form"
              flex={1}
              onSubmit={() => setFilters({ ...filters, search })}
            >
              <Input
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder="Rechercher..."
              />
              <Button hidden type="submit" />
            </Box>
            <Button
              variant="primary"
              ml="4"
              leftIcon={<AddIcon />}
              onClick={() => {
                setUserId(undefined);
                onOpen();
              }}
            >
              Ajouter un utilisateur
            </Button>
          </Flex>
          <TableContainer overflowY="auto" flex={1}>
            <Table
              sx={{ td: { py: "2", px: 4 }, th: { px: 4 } }}
              size="md"
              fontSize="14px"
              gap="0"
            >
              <Thead
                zIndex={1}
                position="sticky"
                top="0"
                boxShadow="0 0 6px 0 rgb(0,0,0,0.15)"
                bg="white"
              >
                <Tr>
                  <Th cursor="pointer" onClick={() => {}}>
                    <OrderIcon {...order} column="libelleDiplome" />
                    email
                  </Th>
                  <Th cursor="pointer" onClick={() => {}}>
                    <OrderIcon {...order} column="libelleEtablissement" />
                    firstname
                  </Th>
                  <Th cursor="pointer" onClick={() => {}}>
                    <OrderIcon {...order} column="libelleDepartement" />
                    lastname
                  </Th>
                  <Th cursor="pointer" onClick={() => {}}>
                    <OrderIcon {...order} column="typeDemande" />
                    role
                  </Th>
                  <Th>Code Région</Th>
                  <Th cursor="pointer" onClick={() => {}}>
                    <OrderIcon {...order} column="createdAt" />
                    Ajouté le
                  </Th>
                  <Th isNumeric>actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.users.map((user) => (
                  <Tr height={"60px"} key={user.id} whiteSpace={"pre"}>
                    <Td>{user.email}</Td>
                    <Td>{user.firstname}</Td>
                    <Td>{user.lastname}</Td>
                    <Td>{user.role}</Td>

                    <Td>{user.codeRegion}</Td>
                    <Td>
                      {user.createdAt &&
                        new Date(user.createdAt).toLocaleString()}
                    </Td>
                    <Td isNumeric>
                      <IconButton
                        onClick={() => {
                          setUserId(user.id);
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
          <TableFooter
            pl="4"
            page={filters.page}
            pageSize={30}
            count={data.count}
            onPageChange={(newPage) =>
              setFilters({ ...filters, page: newPage })
            }
          />
          {user && <EditUser isOpen={isOpen} onClose={onClose} user={user} />}
          {!user && <CreateUser isOpen={isOpen} onClose={onClose} />}
        </>
      )}
    </GuardPermission>
  );
};
