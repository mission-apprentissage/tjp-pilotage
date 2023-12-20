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

import { EditUser } from "@/app/(wrapped)/admin/users/EditUser";
import { OrderIcon } from "@/components/OrderIcon";
import { TableFooter } from "@/components/TableFooter";
import { useStateParams } from "@/utils/useFilters";

import { client } from "../../../../api.client";
import { downloadCsv, ExportColumns } from "../../../../utils/downloadCsv";
import { GuardPermission } from "../../../../utils/security/GuardPermission";
import { CreateUser } from "./CreateUser";

const Columns = {
  email: "Email",
  firstname: "Prénom",
  lastname: "Nom",
  role: "Rôle",
  codeRegion: "Code région",
  uais: "Uais",
  createdAt: "Ajouté le",
} satisfies ExportColumns<
  (typeof client.infer)["[GET]/users"]["users"][number]
>;

export default () => {
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
                  <Th
                    cursor="pointer"
                    onClick={() => handleOrder("codeRegion")}
                  >
                    <OrderIcon {...order} column="codeRegion" />
                    {Columns.codeRegion}
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
                    <Td>{user.email}</Td>
                    <Td>{user.firstname}</Td>
                    <Td>{user.lastname}</Td>
                    <Td>{user.role}</Td>

                    <Td>{user.codeRegion}</Td>
                    <Td>{user.uais}</Td>
                    <Td>
                      {user.createdAt &&
                        new Date(user.createdAt).toLocaleString()}
                    </Td>
                    <Td isNumeric>
                      <IconButton
                        variant="ghost"
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
            {!data.users.length && (
              <Box p={6} textAlign="center" color="gray">
                Aucunes données
              </Box>
            )}
          </TableContainer>
          <TableFooter
            pl="4"
            page={filters.page}
            pageSize={10}
            count={data.count}
            onPageChange={(newPage) =>
              setFilters({ ...filters, page: newPage })
            }
            onExport={async () => {
              const data = await client.ref("[GET]/users").query({
                query: { ...filters, ...order, limit: 1000000 },
              });
              downloadCsv("users_export.csv", data.users, Columns);
            }}
          />
          {user && <EditUser isOpen={isOpen} onClose={onClose} user={user} />}
          {!user && <CreateUser isOpen={isOpen} onClose={onClose} />}
        </>
      )}
    </GuardPermission>
  );
};
