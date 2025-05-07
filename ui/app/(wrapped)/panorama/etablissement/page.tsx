import { PageClient } from "./page.client";

const Page = ({ searchParams }: { searchParams: { wrongUai?: string } }) => {
  return <PageClient wrongUai={searchParams.wrongUai} />;
};

export default Page;
