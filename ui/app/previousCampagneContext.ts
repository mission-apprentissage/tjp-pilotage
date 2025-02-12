import {createContext} from 'react';
import type {CampagneType} from 'shared/schema/campagneSchema';

export const PreviousCampagneContext = createContext<{
  campagne?: CampagneType;
  setCampagne: (campagne?: CampagneType) => void;
    }>({ setCampagne: () => {} });
