import {PermissionEnum} from 'shared/enum/permissionEnum';

import {GuardPermission} from '@/utils/security/GuardPermission';

import { PageClient } from './page.client';

const Page = () => (
  <GuardPermission permission={PermissionEnum["restitution/lecture"]}>
    <PageClient />
  </GuardPermission>
);

export default Page;

