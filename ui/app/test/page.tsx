import { Suspense } from "react";
import { SharedCompo } from "shared";

const fetchData = async () => {
  const rep = await fetch("http://server:5000/api");
  return await rep.json();
};

export default async function Home() {
  const data = await fetchData();

  return (
    <Suspense>
      <main>
        <div>Hello world</div>
        <div>{data.hello}</div>
        <SharedCompo />
      </main>
    </Suspense>
  );
}
