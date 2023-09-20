"use client";

import { useSearchParams } from "next/navigation";
import qs from "qs";
import { ApiType } from "shared";

import { api } from "../../../../api.client";
import { GuardPermission } from "../../../../utils/security/GuardPermission";
import {
  defaultIntentionForms,
  PartialIntentionForms,
} from "../intentionForm/defaultFormValues";
import { IntentionForm } from "../intentionForm/IntentionForm";
export default () => {
  const queryParams = useSearchParams();

  const searchParams: {
    values?: PartialIntentionForms;
    metadata?: ApiType<typeof api.getDemande>["metadata"];
  } = qs.parse(queryParams.toString());

  return (
    <GuardPermission permission="intentions/envoi">
      <IntentionForm
        defaultValues={searchParams.values ?? defaultIntentionForms}
        formMetadata={searchParams.metadata}
      />
    </GuardPermission>
  );
};
