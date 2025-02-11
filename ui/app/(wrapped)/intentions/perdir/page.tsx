"use client";

import {redirect} from 'next/navigation';
import {CODES_REGIONS_EXPE_2024} from 'shared/security/securityUtils';

import {useAuth} from '@/utils/security/useAuth';


const Page = () => {
  const { codeRegion } = useAuth();
  const isPartOfExpe = codeRegion && CODES_REGIONS_EXPE_2024.includes(codeRegion);

  return isPartOfExpe ? redirect("/intentions/perdir/saisie") : redirect("/intentions/saisie");
};
export default Page;
