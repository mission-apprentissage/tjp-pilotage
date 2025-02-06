"use client";

import {createContext} from 'react';
import type {CampagneType} from 'shared/schema/campagneSchema';

export const CurrentCampagneContext = createContext<{
  campagne?: CampagneType;
  setCampagne: (campagne?: CampagneType) => void;
    }>({ setCampagne: () => {} });
