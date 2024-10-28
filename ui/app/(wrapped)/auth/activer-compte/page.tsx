import { client } from "@/api.client";

import { ActivateAccountError } from "./ActivateAccountError";
import { ActivateAccountForm } from "./ActivateAccountForm";

export default async function ({ searchParams: { activationToken } }: { searchParams: { activationToken: string } }) {
  try {
    await client.ref("[GET]/auth/check-activation-token").query({
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
}
