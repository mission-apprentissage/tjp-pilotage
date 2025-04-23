import {PermissionEnum} from 'shared/enum/permissionEnum';

import { GuardExpe } from "@/utils/security/GuardExpe";
import { GuardPermission } from "@/utils/security/GuardPermission";

import PageClient from "./client";

const SynthesePage = ({
  params,
}: {
  params: {
    numero: string;
  };
}) => (
  <GuardPermission permission={PermissionEnum["demande/lecture"]}>
    <GuardExpe>
      <PageClient params={params}/>
    </GuardExpe>
  </GuardPermission>
);

export default SynthesePage;
