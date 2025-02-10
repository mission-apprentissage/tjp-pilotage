import { Badge, Box } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import type {PermissionScope} from 'shared/enum/permissionScopeEnum';
import {PermissionScopeEnum} from 'shared/enum/permissionScopeEnum';

// Compteur pour id unique
let i = 0;

const formatScopeLabel = (scope: PermissionScope) => {
  switch (scope) {
  case PermissionScopeEnum["national"]:
    return "National";
  case PermissionScopeEnum["région"]:
    return "Régional";
  case PermissionScopeEnum["uai"]:
    return "Établissement";
  case PermissionScopeEnum["user"]:
    return "Utilisateur";
  case PermissionScopeEnum["role"]:
    return "Limité";
  }
};

const PermissionBadge = ({ rights, scope }: { rights: string[]; scope: PermissionScope }) => {
  const icons = [];
  const getVariant = () => {
    switch (scope) {
    case PermissionScopeEnum["national"]:
      return "lavander";
    case PermissionScopeEnum["région"]:
      return "info";
    case PermissionScopeEnum["uai"]:
      return "draft";
    case PermissionScopeEnum["user"]:
      return "success";
    case PermissionScopeEnum["role"]:
      return "new";
    }
  };

  if (rights.length === 0) {
    return (
      <Badge variant="grey" size="md" fontSize={12}>
        <Box pr="4px">
          <Icon icon="ri:eye-off-fill" />
        </Box>
        Masqué
      </Badge>
    );
  }

  if (rights.includes("lecture")) {
    i++;
    icons.push(
      <Box pr="4px" key={`${i}-permission-badge-icon`} fontSize={12}>
        <Icon icon="ri:eye-fill" />
      </Box>
    );
  }

  if (rights.includes("ecriture")) {
    i++;
    icons.push(
      <Box pr="4px" key={`${i}-permission-badge-icon`} fontSize={12}>
        <Icon icon="ri:pencil-fill" />
      </Box>
    );
  }

  return (
    <Badge variant={getVariant()} size="md" fontSize={12}>
      {icons} {formatScopeLabel(scope)}
    </Badge>
  );
};

export { PermissionBadge };
