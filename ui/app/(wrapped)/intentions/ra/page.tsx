import { GuardPermission } from "@/utils/security/GuardPermission";

import { HubPageClient } from "./hub/page.client";

export default () => {
  return (
    <GuardPermission permission="intentions/lecture">
      <HubPageClient />
    </GuardPermission>
  );
};
