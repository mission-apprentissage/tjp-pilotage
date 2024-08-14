import { GuardPermission } from "@/utils/security/GuardPermission";

import { PilotageNationalClient } from "./page.client";

export default () => {
  return (
    <GuardPermission permission="pilotage-intentions/lecture">
      <PilotageNationalClient />
    </GuardPermission>
  );
};
