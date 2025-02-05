"use client";

import { useContext } from "react";

import { CurrentCampagneContext } from "@/app/context/currentCampagneContext";

export const useCurrentCampagne = () => useContext(CurrentCampagneContext);
