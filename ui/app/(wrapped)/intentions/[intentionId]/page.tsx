import { IntentionForm } from "./IntentionForm";

export default ({
  params: { intentionId },
}: {
  params: {
    intentionId: string;
  };
}) => {
  return (
    <>
      <IntentionForm />
    </>
  );
};
