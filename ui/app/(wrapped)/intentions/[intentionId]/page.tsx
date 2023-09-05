import { GuardPermission } from "@/utils/security/GuardPermission";

import PageClient from "./page.client";

export default ({
  params,
}: {
  params: {
    intentionId: string;
  };
}) => {
  return (
    <>
      <GuardPermission permission="intentions/envoi">
        <PageClient params={params}></PageClient>
      </GuardPermission>
    </>
  );
};
