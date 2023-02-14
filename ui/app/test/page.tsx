import { Suspense } from "react";

const fetchData = async () => {
  const rep = await fetch("http://server:5000/api", { cache: "no-store" });
  return await rep.json();
};

export default async function Home() {
  const data = await fetchData();

  return (
    <Suspense>
      <main>
        <div>Hello world</div>
        <div>{data.hello}</div>
      </main>
    </Suspense>
  );
}
