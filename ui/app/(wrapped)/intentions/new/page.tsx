import { GuardPermission } from "../../../../utils/security/GuardPermission";
import { defaultIntentionForms } from "../intentionForm/defaultFormValues";
import { IntentionForm } from "../intentionForm/IntentionForm";
export default () => {
  return (
    <GuardPermission permission="intentions/envoi">
      <IntentionForm defaultValues={defaultIntentionForms} />
    </GuardPermission>
  );
};
