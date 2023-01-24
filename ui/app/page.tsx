import { useEffect } from "react";
import { padmd, SharedCompo, toto } from "shared";
import { Compo } from "@/Compo";

export default function Home() {
  console.log("lay");

  return (
    <main>
      Hellod worldfarr {toto} {padmd} <Compo /> <SharedCompo />
    </main>
  );
}
