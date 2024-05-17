"use client";

import {
  Box,
  Heading,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
} from "@chakra-ui/react";
import _ from "lodash";
import { useState } from "react";
import { getPermissionScope, Permission, PERMISSIONS, Role } from "shared";
import { Scope } from "shared/security/permissions";

import { GuardPermission } from "@/utils/security/GuardPermission";

import { themeDefinition } from "../../../../theme/theme";
import { PermissionBadge } from "./components/PermissionBadge";
import { User, UserSearchBar } from "./components/UserSearchBar";
import { PERMISSION_GROUP_LABELS, ROLES_LABELS } from "./const";

const ROLES = Object.keys(ROLES_LABELS) as Array<keyof typeof PERMISSIONS>;
const ALL_PERMISSIONS: Array<Permission> = [];
Object.keys(PERMISSIONS).forEach((key: string) => {
  const role = key as Role;
  const ROLE_PERMISSIONS = PERMISSIONS[role];
  ALL_PERMISSIONS.push(...(Object.keys(ROLE_PERMISSIONS) as Permission[]));
});

const PERMISSION_GROUPS = _.uniq(ALL_PERMISSIONS.map((p) => p.split("/")[0]));

const getPermissionsForRole = (role: Role) => {
  return Object.keys(PERMISSIONS[role]) as Permission[];
};

const getPermissionsFromGroup = (
  permissions: Array<Permission>,
  group: string
) => {
  return permissions
    .filter((p) => p.split("/")[0] === group)
    .map((p) => p.split("/")[1]);
};

const getScopeFromGroup = (role: Role, group: string): Scope => {
  const rolePermissions = PERMISSIONS[role];
  const permission = Object.keys(rolePermissions).filter(
    (key) => key.split("/")[0] === group
  )[0] as Permission;

  return getPermissionScope(role, permission)?.default ?? "national";
};

export default () => {
  const [selectedUser, setSelectedUser] = useState<User>();

  return (
    <GuardPermission permission="users/lecture">
      <Box py="16px" px="64px" width="100%" display={"block"}>
        <VStack gap="16px" width="100%">
          <HStack gap="22px" width="100%" px="8px">
            <Heading fontWeight={700} fontSize="17.5px">
              Visualiser les permissions d’un utilisateur en fonction de son
              rôle
            </Heading>
            <UserSearchBar updateUser={setSelectedUser} user={selectedUser} />
          </HStack>
          <TableContainer position="relative">
            <Table variant="simple">
              <Thead>
                <Tr
                  borderBottom={`1px solid ${themeDefinition.colors.grey[850]}`}
                >
                  <Th
                    position="sticky"
                    borderBottom={"none"}
                    fontSize="12px"
                    fontWeight={700}
                  >
                    Rôle
                  </Th>
                  <Th
                    borderRight={`1px solid ${themeDefinition.colors.grey[850]}`}
                    position="sticky"
                    borderBottom={"none"}
                    fontSize="12px"
                    fontWeight={700}
                  >
                    Description
                  </Th>
                  {PERMISSION_GROUPS.map((p) => (
                    <Th
                      key={p}
                      borderBottom={"none"}
                      fontSize="12px"
                      fontWeight={700}
                    >
                      {PERMISSION_GROUP_LABELS[p]}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {ROLES.map((role) => (
                  <Tr
                    key={role}
                    bgColor={
                      role === selectedUser?.role
                        ? themeDefinition.colors.bluefrance[950]
                        : "transparent"
                    }
                    borderRadius="4px"
                  >
                    <Td
                      position="sticky"
                      textTransform={"uppercase"}
                      fontSize="14px"
                      fontWeight={700}
                      borderBottom={"none"}
                    >
                      {ROLES_LABELS[role](selectedUser?.codeRegion).label}
                    </Td>
                    <Td
                      borderRight={`1px solid ${themeDefinition.colors.grey[850]}`}
                      position="sticky"
                      maxWidth="300px"
                      borderBottom={"none"}
                    >
                      <Tooltip
                        label={
                          ROLES_LABELS[role](selectedUser?.codeRegion)
                            .description
                        }
                      >
                        <Text
                          textOverflow={"ellipsis"}
                          isTruncated
                          height="200%"
                        >
                          {
                            ROLES_LABELS[role](selectedUser?.codeRegion)
                              .description
                          }
                        </Text>
                      </Tooltip>
                    </Td>
                    {PERMISSION_GROUPS.map((label) => (
                      <Td key={label} borderBottom={"none"}>
                        <PermissionBadge
                          rights={getPermissionsFromGroup(
                            getPermissionsForRole(role),
                            label
                          )}
                          scope={getScopeFromGroup(role, label)}
                        />
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </VStack>
      </Box>
    </GuardPermission>
  );
};
