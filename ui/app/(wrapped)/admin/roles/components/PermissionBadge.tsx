import { Badge, Box } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import type { Scope } from "shared/security/permissions";

// Compteur pour id unique
let i = 0;

const formatScopeLabel = (scope: Scope) => {
  switch (scope) {
    case "national":
      return "National";
    case "region":
      return "Régional";
    case "uai":
      return "Établissement";
    case "user":
      return "Utilisateur";
    case "role":
      return "Limité";
  }
};

const PermissionBadge = ({ rights, scope }: { rights: string[]; scope: Scope }) => {
  const icons = [];
  const getVariant = () => {
    switch (scope) {
      case "national":
        return "lavander";
      case "region":
        return "info";
      case "uai":
        return "draft";
      case "user":
        return "success";
      case "role":
        return "new";
    }
  };

  if (rights.length === 0) {
    return (
      <Badge variant="grey" size="md">
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
      <Box pr="4px" key={`${i}-permission-badge-icon`}>
        <Icon icon="ri:eye-fill" />
      </Box>
    );
  }

  if (rights.includes("ecriture")) {
    i++;
    icons.push(
      <Box pr="4px" key={`${i}-permission-badge-icon`}>
        <Icon icon="ri:pencil-fill" />
      </Box>
    );
  }

  return (
    <Badge variant={getVariant()} size="md">
      {icons} {formatScopeLabel(scope)}
    </Badge>
  );
};

export { PermissionBadge };
