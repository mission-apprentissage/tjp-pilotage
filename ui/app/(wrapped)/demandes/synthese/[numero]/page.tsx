import {PermissionEnum} from 'shared/enum/permissionEnum';

import { GuardAccesDemande } from "@/utils/security/GuardAccesDemande";
import { GuardPermission } from "@/utils/security/GuardPermission";

import { PageClient } from "./page.client";

const SynthesePage = ({
  params,
}: {
  params: {
    numero: string;
  };
}) => (
  <GuardPermission permission={PermissionEnum["demande/lecture"]}>
    <GuardAccesDemande>
      <PageClient params={params}/>
    </GuardAccesDemande>
  </GuardPermission>
);

export default SynthesePage;
