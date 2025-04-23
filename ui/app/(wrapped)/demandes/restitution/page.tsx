import {PermissionEnum} from 'shared/enum/permissionEnum';

import { GuardExpe } from "@/utils/security/GuardExpe";
import { GuardPermission } from "@/utils/security/GuardPermission";

import { PageClient } from "./page.client";

const Page = () => (
  <GuardPermission permission={PermissionEnum["restitution/lecture"]}>
    <GuardExpe>
      <PageClient />
    </GuardExpe>
  </GuardPermission>
);

export default Page;
