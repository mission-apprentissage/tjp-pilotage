import { PermissionEnum } from 'shared/enum/permissionEnum';

import { GuardPermission } from "@/utils/security/GuardPermission";

import { DocumentationClient } from "./page.client";

export const revalidate = 60;

export default function Documentation() {
  return (
    <GuardPermission permission={PermissionEnum["intentions/lecture"]}>
      <DocumentationClient />
    </GuardPermission>
  );
}
