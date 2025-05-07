"use client";

import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import type { CampagneType } from "shared/schema/campagneSchema";

import { isUserPartOfExpe } from '@/utils/isPartOfExpe';

import { useAuth } from './useAuth';
import { useCurrentCampagne } from './useCurrentCampagne';


/**
 *
 * Guard permettant de filtrer les users en fonction de s'ils doivent pouvoir accéder à l'expérimentation perdir ou non
 *
 * @returns
 */

export const GuardExpe = ({
  campagne,
  children
}: {
  campagne?: CampagneType;
  children: ReactNode
}) => {
  const { user } = useAuth();
  const { campagne: currentCampagne } = useCurrentCampagne();
  return isUserPartOfExpe({ user, campagne: campagne ?? currentCampagne }) ? (<>{children}</>) : redirect("/");
};
