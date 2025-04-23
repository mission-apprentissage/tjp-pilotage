import {PermissionEnum} from 'shared/enum/permissionEnum';

import { GuardExpe } from "@/utils/security/GuardExpe";
import { GuardPermission } from "@/utils/security/GuardPermission";

import { PageClient } from "./page.client";

const SaisiePage = () => (
  <GuardPermission permission={PermissionEnum["demande/lecture"]}>
    <GuardExpe>
      <PageClient />
    </GuardExpe>
  </GuardPermission>
);

export default SaisiePage;
