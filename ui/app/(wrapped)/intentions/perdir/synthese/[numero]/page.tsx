import { GuardPermission } from "@/utils/security/GuardPermission";

import PageClient from "./client";

export default ({
  params,
}: {
  params: {
    numero: string;
  };
}) => (
  <GuardPermission permission="intentions-perdir/lecture">
    <PageClient params={params}></PageClient>
  </GuardPermission>
);
