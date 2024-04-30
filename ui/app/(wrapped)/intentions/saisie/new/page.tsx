"use client";

import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

import { client } from "../../../../../api.client";
import { GuardPermission } from "../../../../../utils/security/GuardPermission";
import { IntentionSpinner } from "../components/IntentionSpinner";
import { IntentionForm } from "../intentionForm/IntentionForm";

export default () => {
  const { data: defaultCampagne, isLoading } = client
    .ref("[GET]/campagne/default")
    .useQuery({});

  if (isLoading) {
    return <IntentionSpinner />;
  }

  return (
    <GuardPermission permission="intentions/ecriture">
      <IntentionForm
        disabled={defaultCampagne?.statut !== CampagneStatutEnum["en cours"]}
        defaultValues={{
          campagneId: defaultCampagne?.id,
          // TO DELETE
          cfd: "40031112",
          codeDispositif: "247",
          uai: "0261265J",
          recrutementRH: false,
          formationRH: false,
          professeurAssocieRH: false,
          amiCma: false,
          mixte: false,
          coloration: false,
          capaciteScolaireActuelle: 10,
          capaciteScolaire: 12,
          typeDemande: "ouverture_nette",
          rentreeScolaire: 2025,
          reconversionRH: false,
        }}
        formMetadata={{}}
        campagne={defaultCampagne}
      />
    </GuardPermission>
  );
};
