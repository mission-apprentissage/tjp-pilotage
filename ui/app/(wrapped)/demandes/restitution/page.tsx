import {PermissionEnum} from 'shared/enum/permissionEnum';

import { GuardAccesDemande } from '@/utils/security/GuardAccesDemande';
import { GuardPermission } from "@/utils/security/GuardPermission";

import { PageClient } from "./page.client";

const Page = () => (
  <GuardPermission permission={PermissionEnum["restitution/lecture"]}>
    <GuardAccesDemande>
      <PageClient />
    </GuardAccesDemande>
  </GuardPermission>
);

export default Page;
