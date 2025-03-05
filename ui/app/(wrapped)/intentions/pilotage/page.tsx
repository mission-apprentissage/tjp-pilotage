import {PermissionEnum} from 'shared/enum/permissionEnum';

import { GuardPermission } from "@/utils/security/GuardPermission";

import { PilotageNationalClient } from "./page.client";

const IntentionsPilotagePage = () => {
  return (
    <GuardPermission permission={PermissionEnum["pilotage-intentions/lecture"]}>
      <PilotageNationalClient />
    </GuardPermission>
  );
};

export default IntentionsPilotagePage;
