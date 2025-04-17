import { PermissionEnum } from 'shared/enum/permissionEnum';

import { GuardPermission } from "@/utils/security/GuardPermission";

import { DocumentationClient } from "./page.client";

export default function Documentation() {
  return (
    <GuardPermission permission={PermissionEnum["demande/lecture"]}>
      <DocumentationClient />
    </GuardPermission>
  );
}
