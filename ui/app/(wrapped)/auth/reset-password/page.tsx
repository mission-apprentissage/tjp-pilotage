import { ResetPasswordForm } from "./ResetPasswordForm";

const Page = ({
  searchParams: { resetPasswordToken },
}: {
  searchParams: { resetPasswordToken: string };
}) => (
  <ResetPasswordForm resetPasswordToken={resetPasswordToken} />
);

export default Page;
