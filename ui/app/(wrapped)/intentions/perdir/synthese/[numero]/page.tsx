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
    <PageClient params={params}></PageClient>
  </GuardPermission>
);

export default IntentionsPerDirSynthesePage;
