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
import type { Role } from "shared";
import { getPermissionScope, PERMISSIONS } from "shared";
import type {PermissionScope} from 'shared/enum/permissionScopeEnum';
import type { Permission } from "shared/security/permissions";

import { themeDefinition } from "@/theme/theme";
import { GuardPermission } from "@/utils/security/GuardPermission";

import { PermissionBadge } from "./components/PermissionBadge";
import type { User } from "./components/UserSearchBar";
import { UserSearchBar } from "./components/UserSearchBar";
import { OVERRIDES, PERMISSION_GROUP_LABELS, ROLES_LABELS } from "./const";

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

const getPermissionsFromGroup = (permissions: Array<Permission>, group: string) => {
  return permissions.filter((p) => p.split("/")[0] === group);
};

const formatPermissions = (permissions: Array<Permission>) => {
  return permissions.map((p) => p.split("/")[1]);
};

const getScopeFromGroup = (role: Role, group: string): PermissionScope => {
  const rolePermissions = PERMISSIONS[role];
  const permission = Object.keys(rolePermissions).filter((key) => key.split("/")[0] === group)[0] as Permission;

  return getPermissionScope(role, permission) ?? "national";
};

const formatRights = (role: Role, label: string, user?: User) => {
  const permissions = getPermissionsFromGroup(getPermissionsForRole(role), label);

  const overridePermissions = permissions.filter((p) => {
    const roleOverrides = OVERRIDES[role];
    const permissionOverride = roleOverrides !== undefined ? roleOverrides[p] : undefined;
    if (permissionOverride && user) {
      return permissionOverride(user.codeRegion);
    }
    return true;
  });

  return formatPermissions(overridePermissions);
};

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default () => {
  const [selectedUser, setSelectedUser] = useState<User>();

  return (
    <GuardPermission permission="users/lecture">
      <Box py="16px" px="64px" width="100%" display={"block"}>
        <VStack gap="16px" width="100%">
          <HStack gap="22px" width="100%" px="8px">
            <Heading fontWeight={700} fontSize="17.5px">
              Visualiser les permissions d’un utilisateur en fonction de son rôle
            </Heading>
            <UserSearchBar updateUser={setSelectedUser} user={selectedUser} />
          </HStack>
          <TableContainer position="relative">
            <Table variant="simple">
              <Thead>
                <Tr borderBottom={`1px solid ${themeDefinition.colors.grey[850]}`}>
                  <Th
                    position="sticky"
                    zIndex="200"
                    backgroundColor="white"
                    left="0"
                    // Obligé de mettre min & maxWidth ici parce que width est surchargé par chakra
                    maxWidth="200px"
                    minWidth="200px"
                    borderBottom={"none"}
                    fontSize={12}
                    fontWeight={700}
                  >
                    Rôle
                  </Th>
                  <Th
                    position="sticky"
                    zIndex="200"
                    backgroundColor="white"
                    left="200px"
                    width="275px"
                    borderBottom={"none"}
                    fontSize={12}
                    fontWeight={700}
                    boxShadow={`inset -2px 0px 0px 0px ${themeDefinition.colors.grey[850]}`}
                  >
                    Description
                  </Th>
                  {PERMISSION_GROUPS.map((p) => (
                    <Th key={p} borderBottom={"none"} fontSize={12} fontWeight={700} textAlign={"center"}>
                      {PERMISSION_GROUP_LABELS[p]}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {ROLES.map((role) => (
                  <Tr
                    key={role}
                    bgColor={role === selectedUser?.role ? themeDefinition.colors.bluefrance[950] : "white"}
                    _hover={{
                      backgroundColor: themeDefinition.colors.blueecume[925],
                    }}
                    borderRadius="4px"
                  >
                    <Td
                      position="sticky"
                      zIndex="200"
                      bgColor="inherit"
                      left="0"
                      width="200px"
                      textTransform={"uppercase"}
                      fontSize={14}
                      fontWeight={700}
                      borderBottom={"none"}
                    >
                      {ROLES_LABELS[role](selectedUser?.codeRegion).label}
                    </Td>
                    <Td
                      position="sticky"
                      zIndex="200"
                      bgColor="inherit"
                      left="200px"
                      maxWidth="300px"
                      borderBottom={"none"}
                      paddingRight="12px"
                      boxShadow={`inset -2px 0px 0px 0px ${themeDefinition.colors.grey[850]}`}
                    >
                      <Tooltip label={ROLES_LABELS[role](selectedUser?.codeRegion).description}>
                        <Text textOverflow={"ellipsis"} isTruncated height="200%" width="100%">
                          {ROLES_LABELS[role](selectedUser?.codeRegion).description}
                        </Text>
                      </Tooltip>
                    </Td>
                    {PERMISSION_GROUPS.map((label) => (
                      <Td key={role + label} borderBottom={"none"} textAlign="center">
                        <PermissionBadge
                          rights={formatRights(role, label, selectedUser)}
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
