import { GuardExpe } from "@/utils/security/GuardExpe";
import { GuardPermission } from "@/utils/security/GuardPermission";

import PageClient from "./client";

const IntentionsPerDirSynthesePage = ({
  params,
}: {
  params: {
    numero: string;
  };
}) => (
  <GuardPermission permission="intentions-perdir/lecture">
    <GuardExpe isExpeRoute={true}>
      <PageClient params={params}/>
    </GuardExpe>
  </GuardPermission>
);

export default IntentionsPerDirSynthesePage;
