import { Badge, Box } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { Scope } from "shared/security/permissions";

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
  }
};

const PermissionBadge = ({
  rights,
  scope,
}: {
  rights: string[];
  scope: Scope;
}) => {
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
    }
  };

  if (rights.length === 0) {
    return (
      <Badge variant="grey" size="sm">
        <Box pr="4px">
          <Icon icon="ri:eye-off-fill" />
        </Box>
        Masqué
      </Badge>
    );
  }

  if (rights.includes("lecture")) {
    icons.push(
      <Box pr="4px">
        <Icon icon="ri:eye-fill" />
      </Box>
    );
  }

  if (rights.includes("ecriture")) {
    icons.push(
      <Box pr="4px">
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
