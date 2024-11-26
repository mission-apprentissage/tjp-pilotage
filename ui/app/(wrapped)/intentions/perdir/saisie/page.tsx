import { GuardPermission } from "@/utils/security/GuardPermission";

import { PageClient } from "./page.client";

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default () => {
  return (
    <GuardPermission permission="intentions-perdir/lecture">
      <PageClient />
    </GuardPermission>
  );
};
