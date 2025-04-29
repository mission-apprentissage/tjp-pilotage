import { serverClient } from "@/api.client";

import { PageClient } from "./page.client";

const Page = async () => {
  const regionOptions = await serverClient.ref("[GET]/regions").query({});
  return <PageClient regionOptions={regionOptions} />;
};

export default Page;
