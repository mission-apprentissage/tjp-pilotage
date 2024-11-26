import { GuardPermission } from "@/utils/security/GuardPermission";

import { PageClient } from "./page.client";

const SaisiePage = () => {
  return (
    <GuardPermission permission="intentions/lecture">
      <PageClient />
    </GuardPermission>
  );
};

export default SaisiePage;
