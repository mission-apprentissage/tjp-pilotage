import { GuardPermission } from "@/utils/security/GuardPermission";

import { PageClient } from "./client";

const Page = ({
  params,
}: {
  params: {
    numero: string;
  };
}) => (
  <GuardPermission permission="intentions-perdir/lecture">
    <PageClient params={params} />
  </GuardPermission>
);

export default Page;
