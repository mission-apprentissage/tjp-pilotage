import { GuardPermission } from "@/utils/security/GuardPermission";

import { PageClient } from "./page.client";

export default () => {
  return (
    <GuardPermission permission="intentions-perdir/lecture">
      <PageClient />
    </GuardPermission>
  );
};
