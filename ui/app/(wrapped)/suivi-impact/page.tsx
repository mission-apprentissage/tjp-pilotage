import { GuardPermission } from "@/utils/security/GuardPermission";

import { PageClient } from "./page.client";

const Page = () => (
  <GuardPermission permission="suivi-impact/lecture">
    <PageClient />
  </GuardPermission>
);

export default Page;
