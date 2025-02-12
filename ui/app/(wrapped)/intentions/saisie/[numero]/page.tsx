import {GuardExpe} from '@/utils/security/GuardExpe';
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
  <GuardPermission permission="intentions/lecture">
    <GuardExpe isExpeRoute={false}>
      <PageClient params={params} />
    </GuardExpe>
  </GuardPermission>
);
