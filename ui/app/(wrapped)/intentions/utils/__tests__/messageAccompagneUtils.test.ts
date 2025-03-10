import type { Role} from 'shared';
import { RoleEnum } from 'shared';
import type { CampagneStatut} from 'shared/enum/campagneStatutEnum';
import { CampagneStatutEnum } from 'shared/enum/campagneStatutEnum';
import type { CampagneType } from "shared/schema/campagneSchema";
import type { UserType } from "shared/schema/userSchema";
import {beforeEach,describe, expect, it} from 'vitest';

import { CAMPAGNE_EN_ATTENTE, CAMPAGNE_TERMINEE, CAMPAGNE_UNIQUEMENT_MODIFICATION, getMessageAccompagnementCampagne, PAS_DE_CAMPAGNE_REGIONALE_EN_COURS, PAS_DE_CURRENT_CAMPAGNE_REGIONALE_EN_COURS } from '@/app/(wrapped)/intentions/utils/messageAccompagnementUtils';


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
      campagneTerminee: (annee?: string) => {
        campagne = createCampagneBuilder({annee: annee ?? "2024", statut: CampagneStatutEnum["terminée"]});
      },
      campagneEnAttente: (annee?: string) => {
        campagne = createCampagneBuilder({annee: annee ?? "2024", statut: CampagneStatutEnum["en attente"]});
      },
      campagneEnCoursAvecCampagneRegion: (annee?: string) => {
        campagne = createCampagneBuilder({annee: annee ?? "2024", statut: CampagneStatutEnum["en cours"], codeRegion: "76"});
      },
      campagneEnCoursSansCampagneRegion: (annee?: string) => {
        campagne = createCampagneBuilder({annee: annee ?? "2024", statut: CampagneStatutEnum["en cours"]});
      },
      currentCampagne: (annee?: string) => {
        currentCampagne = createCampagneBuilder({annee: annee ?? "2024"});
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
      verifierPasDeCurrentCampagneEnCours: () => {
        expect(messageAccompagnement).toEqual(
          createMessageAccompagnementBuilder({
            campagne,
            currentCampagne,
            messageAccompagnementCampagne: PAS_DE_CURRENT_CAMPAGNE_REGIONALE_EN_COURS
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


describe("ui > app > (wrapped) > intentions > utils > messageAccompagnementUtils", () => {
  let fixture: ReturnType<typeof fixtureBuilder>;

  beforeEach(() => {
    fixture = fixtureBuilder();
  });

  it("Aucun message ne doit être affiché dans le cas où la campagne régionale est ouverte", () => {
    fixture.given.utilisateurAdminRegion();
    fixture.given.campagneEnCoursAvecCampagneRegion("2024");
    fixture.given.currentCampagne("2024");

    fixture.when.getMessageAccompagnementCampagne();

    fixture.then.verifierPasDeMessage();
  });

  it("Affichage du message d'accompagnement pour les campagnes en attente", () => {
    fixture.given.utilisateurAdminRegion();
    fixture.given.campagneEnAttente("2025");
    fixture.given.currentCampagne("2024");

    fixture.when.getMessageAccompagnementCampagne();

    fixture.then.verifierCampagneEnAttente();
  });

  it("Affichage du message d'accompagnement pour les campagnes terminées", () => {
    fixture.given.utilisateurAdminRegion();
    fixture.given.campagneTerminee("2025");
    fixture.given.currentCampagne("2024");

    fixture.when.getMessageAccompagnementCampagne();

    fixture.then.verifierCampagneTerminee();
  });

  it("Affichage du message d'accompagnement si la campagne en cours n'a pas une campagne régionale associée", () => {
    fixture.given.utilisateurAdminRegion();
    fixture.given.campagneEnCoursSansCampagneRegion("2024");
    fixture.given.currentCampagne("2024");

    fixture.when.getMessageAccompagnementCampagne();

    fixture.then.verifierPasDeCurrentCampagneEnCours();
  });

  it("Affichage du message d'accompagne pour une campagne sans campagne régionale associée", () => {
    fixture.given.utilisateurAdminRegion();
    fixture.given.campagneEnCoursSansCampagneRegion("2024");
    fixture.given.currentCampagne("2025");

    fixture.when.getMessageAccompagnementCampagne();

    fixture.then.verifierPasDeCampagneRegionaleEnCours();
  });

});
