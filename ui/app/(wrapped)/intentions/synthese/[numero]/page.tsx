import {PermissionEnum} from 'shared/enum/permissionEnum';

import { GuardPermission } from "@/utils/security/GuardPermission";

import PageClient from "./client";

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default ({
  params,
}: {
  params: {
    numero: string;
  };
}) => (
  <GuardPermission permission={PermissionEnum["intentions-perdir/lecture"]}>
    <PageClient params={params}></PageClient>
  </GuardPermission>
);
