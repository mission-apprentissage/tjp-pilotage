import { GuardPermission } from "@/utils/security/GuardPermission";

import PageClient from "./page.client";

export default ({
  params,
}: {
  params: {
    intentionId: string;
  };
}) => (
  <GuardPermission permission="intentions/lecture">
    <PageClient params={params}></PageClient>
  </GuardPermission>
);
