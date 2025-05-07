import { serverClient } from "@/api.client";

import { PageClient } from './page.client';

const Page = async () => {
  const departementsOptions = await serverClient.ref("[GET]/departements").query({});
  return <PageClient departementsOptions={departementsOptions} />;
};

export default Page;
