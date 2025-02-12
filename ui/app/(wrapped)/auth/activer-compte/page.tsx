import { serverClient } from "@/api.client";

import { ActivateAccountError } from "./ActivateAccountError";
import { ActivateAccountForm } from "./ActivateAccountForm";

const Page = async ({ searchParams: { activationToken } }: { searchParams: { activationToken: string } }) => {
  try {
    await serverClient.ref("[GET]/auth/check-activation-token").query({
      query: { activationToken },
    });

    return (
      <div>
        <ActivateAccountForm activationToken={activationToken} />
      </div>
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return <ActivateAccountError message={e.response.data.message} />;
  }
};

export default Page;
