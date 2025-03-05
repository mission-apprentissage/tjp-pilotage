import {PermissionEnum} from 'shared/enum/permissionEnum';

import { GuardExpe } from "@/utils/security/GuardExpe";
import { GuardPermission } from "@/utils/security/GuardPermission";

import { PageClient } from "./page.client";

const SaisiePage = () => {
  return (
    <GuardPermission permission={PermissionEnum["intentions-perdir/lecture"]}>
      <GuardExpe isExpeRoute={true}>
        <PageClient />
      </GuardExpe>
    </GuardPermission>
  );
};
export default SaisiePage;
