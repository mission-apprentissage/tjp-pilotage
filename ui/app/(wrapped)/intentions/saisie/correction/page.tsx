import { GuardPermission } from "@/utils/security/GuardPermission";

import PageClient from "./client";

export default ({
  params,
}: {
  params: {
    numero: string;
  };
}) => (
  <GuardPermission permission="intentions/lecture">
    <PageClient params={params}></PageClient>
  </GuardPermission>
);
