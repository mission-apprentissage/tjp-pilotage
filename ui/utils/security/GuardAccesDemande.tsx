"use client";

import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import type { CampagneType } from "shared/schema/campagneSchema";

import {isUserPartOfAccesDemande} from '@/utils/isPartOfAccesDemande';

import { useAuth } from './useAuth';
import { useCurrentCampagne } from './useCurrentCampagne';


/**
 *
 * Guard permettant de filtrer les users en fonction de s'ils doivent pouvoir accéder à l'expérimentation perdir ou non
 *
 * @returns
 */

export const GuardAccesDemande = ({
  campagne,
  children
}: {
  campagne?: CampagneType;
  children: ReactNode
}) => {
  const { user } = useAuth();
  const { campagne: currentCampagne } = useCurrentCampagne();
  return isUserPartOfAccesDemande({ user, campagne: campagne ?? currentCampagne }) ? (<>{children}</>) : redirect("/");
};
