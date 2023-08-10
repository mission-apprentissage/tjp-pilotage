import { ResetPasswordForm } from "./ResetPasswordForm";

export default async function ({
  searchParams: { resetPasswordToken },
}: {
  searchParams: { resetPasswordToken: string };
}) {
  return (
    <div>
      <ResetPasswordForm resetPasswordToken={resetPasswordToken} />
    </div>
  );
}
