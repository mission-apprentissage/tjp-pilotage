import {PermissionEnum} from 'shared/enum/permissionEnum';

import { GuardPermission } from "@/utils/security/GuardPermission";

import { PilotageNationalClient } from "./page.client";

const PilotagePage = () => {
  return (
    <GuardPermission permission={PermissionEnum["pilotage/lecture"]}>
      <PilotageNationalClient />
    </GuardPermission>
  );
};

export default PilotagePage;
