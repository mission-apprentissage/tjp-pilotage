import { GuardPermission } from "@/utils/security/GuardPermission";

import { PageClient } from "./client";

const Page = ({
  params,
}: {
  params: {
    numero: string;
  };
}) => (
  <GuardPermission permission="intentions/lecture">
    <PageClient params={params} />
  </GuardPermission>
);

export default Page;
