import { GuardPermission } from "@/utils/security/GuardPermission";
import { PilotageIntentionsClient } from "./client";

export default () => {
  return (
    <GuardPermission permission="pilotage-intentions/lecture">
      <PilotageIntentionsClient />
    </GuardPermission>
  );
};
