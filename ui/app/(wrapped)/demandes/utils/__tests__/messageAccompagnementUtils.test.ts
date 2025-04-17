import type { Role} from 'shared';
import { RoleEnum } from 'shared';
import type { CampagneStatut} from 'shared/enum/campagneStatutEnum';
import { CampagneStatutEnum } from 'shared/enum/campagneStatutEnum';
import type { CampagneType } from "shared/schema/campagneSchema";
import type { UserType } from "shared/schema/userSchema";
import {beforeEach,describe, expect, it} from 'vitest';

import { CAMPAGNE_EN_ATTENTE, CAMPAGNE_TERMINEE, CAMPAGNE_UNIQUEMENT_MODIFICATION, getMessageAccompagnementCampagne, PAS_DE_CAMPAGNE_REGIONALE_EN_COURS } from '@/app/(wrapped)/demandes/utils/messageAccompagnementUtils';

const createUserBuilder = ({
  role,
  codeRegion
}:{
  role: Role,
  codeRegion?: string
}): UserType => ({
  id: "test",
  email: "email@test.fr",
  role: role,
  codeRegion: codeRegion,
  uais: [],
});

const createCampagneBuilder = ({
  annee,
  statut = CampagneStatutEnum["en cours"],
  codeRegion,
  withSaisiePerdir,
} : {
  annee: string,
  statut?: CampagneStatut,
  codeRegion?: string,
  withSaisiePerdir?: boolean,
}): CampagneType => ({
  id: `testid-${annee}`,
  dateDebut: `${annee}-01-01`,
  dateFin: `${annee}-12-31`,
  annee,
  statut,
  codeRegion,
  withSaisiePerdir,
});

const createMessageAccompagnementBuilder = ({
  campagne,
  currentCampagne,
  messageAccompagnementCampagne
} : {
  campagne: CampagneType,
  currentCampagne: CampagneType,
  messageAccompagnementCampagne: string
}) => messageAccompagnementCampagne.replace("$ANNEE_CAMPAGNE", campagne.annee).replace("$CURRENT_ANNEE_CAMPAGNE", currentCampagne.annee);

const fixtureBuilder = () => {
  let user: UserType | undefined = undefined;
  let campagne: CampagneType = createCampagneBuilder({annee: "2024"});
  let currentCampagne: CampagneType = createCampagneBuilder({annee: "2024"});
  let messageAccompagnement: string | undefined = undefined;

  return {
    given: {
      utilisateurAdminRegion: () => {
        user = createUserBuilder({role: RoleEnum["admin_region"], codeRegion: "76"});
      },
      campagne: (annee?: string, statut?: CampagneStatut) => {
        campagne = createCampagneBuilder({annee: annee ?? "2024", statut, codeRegion: "76"});
      },
      campagneNationale: (annee?: string, statut?: CampagneStatut) => {
        campagne = createCampagneBuilder({annee: annee ?? "2024", statut});
      },
      currentCampagneNationale: (annee?: string) => {
        currentCampagne = createCampagneBuilder({annee: annee ?? "2024"});
      },
      currentCampagneRegionaleWithSaisiePerdir: (annee?: string) => {
        currentCampagne = createCampagneBuilder({annee: annee ?? "2024", codeRegion: "76", withSaisiePerdir: true});
      },
      currentCampagneRegionaleWithoutSaisiePerdir: (annee?: string) => {
        currentCampagne = createCampagneBuilder({annee: annee ?? "2024", codeRegion: "76", withSaisiePerdir: false});
      },
    },
    when: {
      getMessageAccompagnementCampagne: () => {
        messageAccompagnement = getMessageAccompagnementCampagne({campagne, currentCampagne, user});
      },
    },
    then: {
      verifierCampagneUniquementModif: () => {
        expect(messageAccompagnement).toEqual(
          createMessageAccompagnementBuilder({
            campagne,
            currentCampagne,
            messageAccompagnementCampagne: CAMPAGNE_UNIQUEMENT_MODIFICATION
          })
        );
      },
      verifierPasDeCampagneRegionaleEnCours: () => {
        expect(messageAccompagnement).toEqual(
          createMessageAccompagnementBuilder({
            campagne,
            currentCampagne,
            messageAccompagnementCampagne: PAS_DE_CAMPAGNE_REGIONALE_EN_COURS
          })
        );
      },
      verifierCampagneTerminee: () => {
        expect(messageAccompagnement).toEqual(
          createMessageAccompagnementBuilder({
            campagne,
            currentCampagne,
            messageAccompagnementCampagne: CAMPAGNE_TERMINEE
          })
        );
      },
      verifierCampagneEnAttente: () => {
        expect(messageAccompagnement).toEqual(
          createMessageAccompagnementBuilder({
            campagne,
            currentCampagne,
            messageAccompagnementCampagne: CAMPAGNE_EN_ATTENTE
          })
        );
      },
      verifierPasDeMessage: () => {
        expect(messageAccompagnement).toBeUndefined();
      },
    },
  };
};


describe("ui > app > (wrapped) > demandes > utils > messageAccompagnementUtils", () => {
  let fixture: ReturnType<typeof fixtureBuilder>;

  beforeEach(() => {
    fixture = fixtureBuilder();
  });

  it("Aucun message ne doit être affiché dans le cas où la campagne en cours est une campagne régionale", () => {
    fixture.given.utilisateurAdminRegion();
    fixture.given.campagne("2024");
    fixture.given.currentCampagneRegionaleWithSaisiePerdir("2024");

    fixture.when.getMessageAccompagnementCampagne();

    fixture.then.verifierPasDeMessage();
  });

  it("Aucun message ne doit être affiché dans le cas où la campagne en cours est une campagne nationale", () => {
    fixture.given.utilisateurAdminRegion();
    fixture.given.campagne("2024");
    fixture.given.currentCampagneNationale("2024");

    fixture.when.getMessageAccompagnementCampagne();

    fixture.then.verifierPasDeMessage();
  });

  it("Affichage du message d'accompagnement pour les campagnes en attente", () => {
    fixture.given.utilisateurAdminRegion();
    fixture.given.campagne("2025", CampagneStatutEnum["en attente"]);
    fixture.given.currentCampagneRegionaleWithSaisiePerdir("2024");

    fixture.when.getMessageAccompagnementCampagne();

    fixture.then.verifierCampagneEnAttente();
  });

  it("Affichage du message d'accompagnement pour les campagnes terminées", () => {
    fixture.given.utilisateurAdminRegion();
    fixture.given.campagne("2025", CampagneStatutEnum["terminée"]);
    fixture.given.currentCampagneRegionaleWithSaisiePerdir("2024");

    fixture.when.getMessageAccompagnementCampagne();

    fixture.then.verifierCampagneTerminee();
  });

});
