import { use } from "react";

import { PageClient } from "./page.client";

const Page = ({
  searchParams,
}: {
  readonly searchParams: Promise<{
    wrongUai: string;
}>;
}) => {
  const { wrongUai } = use(searchParams);
  return <PageClient wrongUai={wrongUai} />;
};

export default Page;
