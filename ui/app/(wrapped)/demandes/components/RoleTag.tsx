import { chakra, Tag } from "@chakra-ui/react";
import type { Role } from "shared";

import { formatRole } from "@/utils/formatLibelle";


export const RoleTag = chakra(({ className, role }: { className?: string; role?: Role }) => {
  if (!role) return null;
  return (
    <Tag
      className={className}
      size={"md"}
      variant={"solid"}
      bgColor={"info.950"}
      color={"info.text"}
      gap={1}
      fontSize={12}
      fontWeight={700}
    >
      {formatRole(role)}
    </Tag>
  );
});
