"use client";

import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Badge,
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
import { hasRightOverRole } from "shared";

import { client } from "@/api.client";
import { EditUser } from "@/app/(wrapped)/admin/users/EditUser";
import { OrderIcon } from "@/components/OrderIcon";
import {
  downloadCsv,
  downloadExcel,
  ExportColumns,
} from "@/utils/downloadExport";
import { formatDate } from "@/utils/formatDate";
import { GuardPermission } from "@/utils/security/GuardPermission";
import { useStateParams } from "@/utils/useFilters";

import { TableHeader } from "../../../../components/TableHeader";
import { useAuth } from "../../../../utils/security/useAuth";
import { CreateUser } from "./CreateUser";

const Columns = {
  email: "Email",
  firstname: "Prénom",
  lastname: "Nom",
  role: "Rôle",
  enabled: "Statut",
  libelleRegion: "Région",
  uais: "Uais",
  createdAt: "Ajouté le",
} satisfies ExportColumns<
  (typeof client.infer)["[GET]/users"]["users"][number]
>;

export default () => {
  const { auth } = useAuth();
  const [filters, setFilters] = useStateParams<{
    page: number;
    search?: string;
    order?: "asc" | "desc";
    orderBy?: keyof typeof Columns;
  }>({ defaultValues: { page: 0 } });

  const order = { order: filters.order, orderBy: filters.orderBy };
  const [search, setSearch] = useState(filters.search);

  const handleOrder = (column: Exclude<typeof filters.orderBy, undefined>) => {
    if (order?.orderBy !== column) {
      setFilters({ ...filters, order: "desc", orderBy: column });
      return;
    }
    setFilters({
      ...filters,
      order: order?.order === "asc" ? "desc" : "asc",
      orderBy: column,
    });
  };

  const { data } = client.ref("[GET]/users").useQuery({
    query: {
      ...filters,
      search: filters.search,
      limit: 10,
      offset: filters.page * 10,
    },
  });

  const [userId, setUserId] = useState<string>();
  const user = useMemo(
    () => data?.users.find(({ id }) => id === userId),
    [data, userId]
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const canEditUser = (
    user: (typeof client.infer)["[GET]/users"]["users"][number]
  ) => {
    return (
      auth?.user?.role &&
      user.role &&
      hasRightOverRole({
        sourceRole: auth.user.role,
        targetRole: user.role,
      })
    );
  };

  return (
    <GuardPermission permission="users/lecture">
      {data?.users && (
        <>
          <Flex px={4} py="2">
            <Box
              mt={"auto"}
              mb={1.5}
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
              mt={"auto"}
              mb={1.5}
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
            <TableHeader
              mt={"auto"}
              pl="4"
              page={filters.page}
              pageSize={10}
              count={data.count}
              onPageChange={(newPage) =>
                setFilters({ ...filters, page: newPage })
              }
              onExportCsv={async () => {
                const data = await client.ref("[GET]/users").query({
                  query: { ...filters, ...order, limit: 1000000 },
                });
                downloadCsv("users_export", data.users, Columns);
              }}
              onExportExcel={async () => {
                const data = await client.ref("[GET]/users").query({
                  query: { ...filters, ...order, limit: 1000000 },
                });
                downloadExcel("users_export", data.users, Columns);
              }}
            />
          </Flex>

          <TableContainer overflowY="auto" flex={1}>
            <Table
              sx={{ td: { py: "2", px: 4 }, th: { px: 4 } }}
              size="md"
              fontSize="14px"
              gap="0"
            >
              <Thead
                position="sticky"
                top="0"
                boxShadow="0 0 6px 0 rgb(0,0,0,0.15)"
                bg="white"
              >
                <Tr>
                  <Th w={0} />
                  <Th cursor="pointer" onClick={() => handleOrder("email")}>
                    <OrderIcon {...order} column="email" />
                    {Columns.email}
                  </Th>
                  <Th cursor="pointer" onClick={() => handleOrder("firstname")}>
                    <OrderIcon {...order} column="firstname" />
                    {Columns.firstname}
                  </Th>
                  <Th cursor="pointer" onClick={() => handleOrder("lastname")}>
                    <OrderIcon {...order} column="lastname" />
                    {Columns.lastname}
                  </Th>
                  <Th cursor="pointer" onClick={() => handleOrder("role")}>
                    <OrderIcon {...order} column="role" />
                    {Columns.role}
                  </Th>
                  <Th cursor="pointer" onClick={() => handleOrder("enabled")}>
                    <OrderIcon {...order} column="enabled" />
                    {Columns.enabled}
                  </Th>
                  <Th
                    cursor="pointer"
                    onClick={() => handleOrder("libelleRegion")}
                  >
                    <OrderIcon {...order} column="libelleRegion" />
                    {Columns.libelleRegion}
                  </Th>
                  <Th>{Columns.uais}</Th>
                  <Th cursor="pointer" onClick={() => handleOrder("createdAt")}>
                    <OrderIcon {...order} column="createdAt" />
                    {Columns.createdAt}
                  </Th>
                  <Th isNumeric>actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.users.map((user) => (
                  <Tr height={"60px"} key={user.id} whiteSpace={"pre"}>
                    <Td>
                      <Avatar
                        name={`${user.firstname} ${user.lastname}`}
                        position={"unset"}
                      />
                    </Td>
                    <Td>{user.email}</Td>
                    <Td>{user.firstname}</Td>
                    <Td>{user.lastname}</Td>
                    <Td>{user.role}</Td>
                    <Td>
                      {user.enabled ? (
                        <Badge variant="success">Actif</Badge>
                      ) : (
                        <Badge variant="error">Désactivé</Badge>
                      )}
                    </Td>
                    <Td>{user.libelleRegion}</Td>
                    <Td>{user.uais}</Td>
                    <Td>
                      {user.createdAt && formatDate({ date: user.createdAt })}
                    </Td>
                    <Td isNumeric>
                      {canEditUser(user) && (
                        <IconButton
                          position="unset"
                          variant="ghost"
                          onClick={() => {
                            setUserId(user.id);
                            onOpen();
                          }}
                          aria-label="editer"
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {!data.users.length && (
              <Box p={6} textAlign="center" color="gray">
                Aucunes données
              </Box>
            )}
          </TableContainer>
          {user && isOpen && (
            <EditUser isOpen={isOpen} onClose={onClose} user={user} />
          )}
          {!user && isOpen && <CreateUser isOpen={isOpen} onClose={onClose} />}
        </>
      )}
    </GuardPermission>
  );
};
