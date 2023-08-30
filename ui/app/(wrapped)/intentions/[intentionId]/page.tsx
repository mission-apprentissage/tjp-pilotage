import { GuardPermission } from "@/utils/security/GuardPermission";

import { prefilledIntentionForms } from "../intentionForm/defaultFormValues";
import { IntentionForm } from "../intentionForm/IntentionForm";

export default (_: {
  params: {
    intentionId: string;
  };
}) => {
  return (
    <>
      <GuardPermission permission="intentions/envoi">
        <IntentionForm defaultValues={prefilledIntentionForms} />
      </GuardPermission>
    </>
  );
};
