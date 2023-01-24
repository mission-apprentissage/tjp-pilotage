"use client";

import { useEffect } from "react";

export const Compo = () => {
  console.log("Compo");
  useEffect(() => {
    console.log("compo effet");
  });
  return <div>Compo</div>;
};
