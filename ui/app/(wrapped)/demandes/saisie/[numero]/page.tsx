import {PermissionEnum} from 'shared/enum/permissionEnum';

import { GuardPermission } from "@/utils/security/GuardPermission";

import { PageClient } from "./client";

const Page = ({
  params,
}: {
  params: {
    numero: string;
  };
}) => (
  <GuardPermission permission={PermissionEnum["demande/lecture"]}>
    <PageClient params={params} />
  </GuardPermission>
);

export default Page;
