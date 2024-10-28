import { ResetPasswordForm } from "./ResetPasswordForm";

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
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
