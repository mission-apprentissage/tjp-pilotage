"use client";

import {redirect} from 'next/navigation';

import { getRoutingSaisieRecueilDemande } from '@/utils/getRoutingRecueilDemande';
import {useAuth} from '@/utils/security/useAuth';
import { useCurrentCampagne } from '@/utils/security/useCurrentCampagne';


const Page = () => {
  const { user } = useAuth();
  const { campagne } = useCurrentCampagne();

  return redirect(getRoutingSaisieRecueilDemande({ user, campagne }));
};
export default Page;
