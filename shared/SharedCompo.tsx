import { useEffect } from "react";

export const SharedCompo = () => {
  useEffect(() => {
    console.log("effet SharedCompo");
  });
  return <div>shared copo</div>;
};
