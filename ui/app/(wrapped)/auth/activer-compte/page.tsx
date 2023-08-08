import { ActivateAccountForm } from "./ActivateAccountForm";

export default async function ({
  searchParams: { activationToken },
}: {
  searchParams: { activationToken: string };
}) {
  return (
    <div>
      <ActivateAccountForm activationToken={activationToken} />
    </div>
  );
}
