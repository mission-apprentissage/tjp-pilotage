import type { Role} from 'shared';
import { RoleEnum } from 'shared';
import type { CampagneStatut} from 'shared/enum/campagneStatutEnum';
import { CampagneStatutEnum } from 'shared/enum/campagneStatutEnum';
import type { DemandeStatutType} from 'shared/enum/demandeStatutEnum';
import {DemandeStatutEnum} from 'shared/enum/demandeStatutEnum';
import type { DemandeTypeType} from 'shared/enum/demandeTypeEnum';
import {DemandeTypeEnum} from 'shared/enum/demandeTypeEnum';
import type { CampagneType } from "shared/schema/campagneSchema";
import type { UserType } from "shared/schema/userSchema";
import {beforeEach,describe, expect, it} from 'vitest';

import { canCreateIntention, canDeleteIntention, canEditIntention, canImportIntention, canShowCorrectionButtonIntention } from '@/app/(wrapped)/intentions/utils/permissionsIntentionUtils';

type Intention = { campagne: CampagneType, statut: DemandeStatutType, typeDemande: DemandeTypeType, canEdit: boolean }

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
  hasCampagneRegionEnCours
} : {
  annee: string,
  statut?: CampagneStatut,
  codeRegion?: string,
  withSaisiePerdir?: boolean,
  hasCampagneRegionEnCours?: boolean
}): CampagneType => ({
  id: "testid",
  dateDebut: `${annee}-01-01`,
  dateFin: `${annee}-12-31`,
  annee,
  statut,
  codeRegion,
  withSaisiePerdir,
  hasCampagneRegionEnCours,
});

const createIntentionBuilder = ({
  campagne,
  statut,
  typeDemande,
  canEdit
} : Intention): Intention => ({
  campagne,
  statut,
  typeDemande,
  canEdit
});

const fixtureBuilder = () => {
  let user: UserType | undefined = undefined;
  let campagne: CampagneType = createCampagneBuilder({annee: "2023"});
  let intention: Intention = createIntentionBuilder({
    campagne: createCampagneBuilder({annee: "2023"}),
    statut: DemandeStatutEnum["projet de demande"],
    typeDemande: DemandeTypeEnum["ouverture_nette"],
    canEdit: true
  });
  let isAlreadyImported: boolean | undefined = undefined;
  let canDelete: boolean | undefined = undefined;
  let canEdit: boolean | undefined = undefined;
  let canImport: boolean | undefined = undefined;
  let canCreate: boolean | undefined = undefined;
  let canShowCorrectionButton: boolean | undefined = undefined;


  return {
    given: {
      utilisateurAnonyme: () => {
        user = undefined;
      },
      utilisateurInvite: () => {
        user = createUserBuilder({role: RoleEnum["invite"]});
      },
      utilisateurNational: () => {
        user = createUserBuilder({role: RoleEnum["admin"]});
      },
      utilisateurPerdirExpe: () => {
        user = createUserBuilder({role: RoleEnum["perdir"], codeRegion: "76"});
      },
      utilisateurPerdirHorsExpe: () => {
        user = createUserBuilder({role: RoleEnum["perdir"], codeRegion: "11"});
      },
      utilisateurAdminRegionExpe: () => {
        user = createUserBuilder({role: RoleEnum["admin_region"], codeRegion: "76"});
      },
      utilisateurAdminRegionHorsExpe: () => {
        user = createUserBuilder({role: RoleEnum["admin_region"], codeRegion: "11"});
      },
      utilisateurRegionExpe: () => {
        user = createUserBuilder({role: RoleEnum["expert_region"], codeRegion: "76"});
      },
      utilisateurRegionHorsExpe: () => {
        user = createUserBuilder({role: RoleEnum["expert_region"], codeRegion: "11"});
      },
      campagne2023: () => {
        campagne = createCampagneBuilder({annee: "2023"});
      },
      campagne2023Terminee: () => {
        campagne = createCampagneBuilder({annee: "2023", statut: CampagneStatutEnum["terminée"]});
      },
      campagne2024: () => {
        campagne = createCampagneBuilder({annee: "2024"});
      },
      campagne2025: () => {
        campagne = createCampagneBuilder({annee: "2025"});
      },
      campagneRegionaleEnCoursWithSaisiePerdir: () => {
        campagne = createCampagneBuilder({annee: "2025", hasCampagneRegionEnCours: true, codeRegion: "76", withSaisiePerdir: true});
      },
      campagneRegionaleEnCoursWithoutSaisiePerdir: () => {
        campagne = createCampagneBuilder({annee: "2025", hasCampagneRegionEnCours: true, codeRegion: "76", withSaisiePerdir: false });
      },
      campagne2025EnAttente: () => {
        campagne = createCampagneBuilder({annee: "2025", statut: CampagneStatutEnum["en attente"]});
      },
      intentionEditable: (statut?: DemandeStatutType) => {
        intention = createIntentionBuilder({
          campagne,
          statut: statut ?? DemandeStatutEnum["projet de demande"],
          typeDemande: DemandeTypeEnum["ouverture_nette"],
          canEdit: true
        });
      },
      intentionNonEditable: (statut?: DemandeStatutType) => {
        intention = createIntentionBuilder({
          campagne,
          statut: statut ?? DemandeStatutEnum["projet de demande"],
          typeDemande: DemandeTypeEnum["ouverture_nette"],
          canEdit: false
        });
      },
      intentionValidee: () => {
        intention = createIntentionBuilder({
          campagne,
          statut: DemandeStatutEnum["demande validée"],
          typeDemande: DemandeTypeEnum["ouverture_nette"],
          canEdit: true
        });
      },
      intentionAjustement: () => {
        intention = createIntentionBuilder({
          campagne,
          statut: DemandeStatutEnum["projet de demande"],
          typeDemande: DemandeTypeEnum["ajustement"],
          canEdit: true
        });
      },
      isAlreadyImported: () => {
        isAlreadyImported = true;
      },
      isNotAlreadyImported: () => {
        isAlreadyImported = false;
      },
    },
    when: {
      canDeleteIntention: () => {
        canDelete = canDeleteIntention({intention, user});
      },
      canImportIntention: () => {
        canImport = canImportIntention({
          isAlreadyImported: isAlreadyImported ?? false,
          isLoading: false,
          campagne,
          user
        });
      },
      canEditIntention: () => {
        canEdit = canEditIntention({intention, user});
      },
      canCreateIntention: () => {
        canCreate = canCreateIntention({campagne, user});
      },
      canShowCorrectionButton: () => {
        canShowCorrectionButton = canShowCorrectionButtonIntention({intention, user});
      }
    },
    then: {
      verifierCanCreate: () => {
        expect(canCreate).toBe(true);
      },
      verifierCanNotCreate: () => {
        expect(canCreate).toBe(false);
      },
      verifierCanEdit: () => {
        expect(canEdit).toBe(true);
      },
      verifierCanNotEdit: () => {
        expect(canEdit).toBe(false);
      },
      verifierCanDelete: () => {
        expect(canDelete).toBe(true);
      },
      verifierCanNotDelete: () => {
        expect(canDelete).toBe(false);
      },
      verifierCanImport: () => {
        expect(canImport).toBe(true);
      },
      verifierCanNotImport: () => {
        expect(canImport).toBe(false);
      },
      verifierCanShowCorrectionButton: () => {
        expect(canShowCorrectionButton).toBe(true);
      },
      verifierCanNotShowCorrectionButton: () => {
        expect(canShowCorrectionButton).toBe(false);
      },
    },
  };
};


describe("ui > app > (wrapped) > intentions > utils > permissionsIntentionUtils", () => {
  let fixture: ReturnType<typeof fixtureBuilder>;

  beforeEach(() => {
    fixture = fixtureBuilder();
  });

  it("Un utilisateur national doit pouvoir importer une demande d'une campagne terminée", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne2023Terminee();
    fixture.given.intentionValidee();
    fixture.given.isNotAlreadyImported();

    fixture.when.canImportIntention();
    fixture.then.verifierCanImport();
  });

  it("Un utilisateur national ne doit pas pouvoir importer une demande d'une campagne terminée qui a déjà été importée", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne2023Terminee();
    fixture.given.intentionValidee();
    fixture.given.isAlreadyImported();

    fixture.when.canImportIntention();
    fixture.then.verifierCanNotImport();
  });

  it("Un utilisateur national ne doit pas pouvoir importer une demande d'une campagne non terminée", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne2023();
    fixture.given.intentionValidee();
    fixture.given.isNotAlreadyImported();

    fixture.when.canImportIntention();
    fixture.then.verifierCanNotImport();
  });

  it("Un utilisateur non connecté ne doit pas pouvoir importer une demande", () => {
    fixture.given.utilisateurAnonyme();
    fixture.given.campagne2023Terminee();
    fixture.given.intentionValidee();
    fixture.given.isNotAlreadyImported();

    fixture.when.canImportIntention();
    fixture.then.verifierCanNotImport();
  });

  it("Un utilisateur qui n'a pas les permissions ne doit pas pouvoir importer une demande ou modifier une demande", () => {
    fixture.given.utilisateurInvite();
    fixture.given.campagne2023Terminee();
    fixture.given.intentionValidee();
    fixture.given.isNotAlreadyImported();

    fixture.when.canImportIntention();
    fixture.then.verifierCanNotImport();

    fixture.when.canEditIntention();
    fixture.then.verifierCanNotEdit();

    fixture.when.canCreateIntention();
    fixture.then.verifierCanNotCreate();

    fixture.when.canDeleteIntention();
    fixture.then.verifierCanNotDelete();

    fixture.when.canShowCorrectionButton();
    fixture.then.verifierCanNotShowCorrectionButton();
  });

  it("Un utilisateur national doit pouvoir modifier une demande", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne2024();
    fixture.given.intentionEditable();

    fixture.when.canCreateIntention();
    fixture.then.verifierCanCreate();

    fixture.when.canEditIntention();
    fixture.then.verifierCanEdit();

    fixture.when.canDeleteIntention();
    fixture.then.verifierCanDelete();
  });

  it("Un utilisateur national ne doit pas pouvoir modifier une demande non éditable", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne2024();
    fixture.given.intentionNonEditable();

    fixture.when.canEditIntention();
    fixture.then.verifierCanNotEdit();
  });

  it("Un utilisateur national ne doit pas pouvoir créer ou modifier une demande pendant une campagne terminée", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne2023Terminee();
    fixture.given.intentionEditable();

    fixture.when.canEditIntention();
    fixture.then.verifierCanNotEdit();

    fixture.when.canCreateIntention();
    fixture.then.verifierCanNotCreate();
  });

  it("Un utilisateur national ne doit pas pouvoir créer ou modifier une demande pendant une campagne en attente", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne2025EnAttente();
    fixture.given.intentionEditable();

    fixture.when.canEditIntention();
    fixture.then.verifierCanNotEdit();

    fixture.when.canCreateIntention();
    fixture.then.verifierCanNotCreate();
  });

  it("Un utilisateur admin région hors expérimentation ne doit pas pouvoir créer ou modifier une demande pendant la campagne 2024", () => {
    fixture.given.utilisateurAdminRegionHorsExpe();
    fixture.given.campagne2024();
    fixture.given.intentionEditable();

    fixture.when.canEditIntention();
    fixture.then.verifierCanNotEdit();

    fixture.when.canCreateIntention();
    fixture.then.verifierCanNotCreate();
  });

  it("Un utilisateur perdir hors expérimentation ne doit pas pouvoir créer ou modifier une demande pendant la campagne 2024", () => {
    fixture.given.utilisateurPerdirHorsExpe();
    fixture.given.campagne2024();
    fixture.given.intentionEditable();

    fixture.when.canEditIntention();
    fixture.then.verifierCanNotEdit();

    fixture.when.canCreateIntention();
    fixture.then.verifierCanNotCreate();
  });

  it("Un utilisateur admin région de l'expérimentation doit pouvoir créer ou modifier une demande pendant la campagne 2024", () => {
    fixture.given.utilisateurAdminRegionExpe();
    fixture.given.campagne2024();
    fixture.given.intentionEditable();

    fixture.when.canEditIntention();
    fixture.then.verifierCanEdit();

    fixture.when.canCreateIntention();
    fixture.then.verifierCanCreate();
  });

  it("Un utilisateur perdir de l'expérimentation ne doit pas pouvoir modifier une demande qui lui appartient dans les statuts projet de demande / prêt pour le vote / dossier complet / demande validée / refusée", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.campagne2024();

    fixture.given.intentionEditable(DemandeStatutEnum["projet de demande"]);
    fixture.when.canEditIntention();
    fixture.then.verifierCanNotEdit();

    fixture.given.intentionEditable(DemandeStatutEnum["prêt pour le vote"]);
    fixture.when.canEditIntention();
    fixture.then.verifierCanNotEdit();

    fixture.given.intentionEditable(DemandeStatutEnum["dossier complet"]);
    fixture.when.canEditIntention();
    fixture.then.verifierCanNotEdit();

    fixture.given.intentionEditable(DemandeStatutEnum["demande validée"]);
    fixture.when.canEditIntention();
    fixture.then.verifierCanNotEdit();

    fixture.given.intentionEditable(DemandeStatutEnum["refusée"]);
    fixture.when.canEditIntention();
    fixture.then.verifierCanNotEdit();
  });

  it("Un utilisateur perdir de l'expérimentation doit pouvoir modifier une demande qui lui appartient dans les statuts proposition / brouillon / dossier incomplet", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.campagne2024();

    fixture.given.intentionEditable(DemandeStatutEnum["brouillon"]);
    fixture.when.canEditIntention();
    fixture.then.verifierCanEdit();

    fixture.given.intentionEditable(DemandeStatutEnum["proposition"]);
    fixture.when.canEditIntention();
    fixture.then.verifierCanEdit();

    fixture.given.intentionEditable(DemandeStatutEnum["dossier incomplet"]);
    fixture.when.canEditIntention();
    fixture.then.verifierCanEdit();
  });

  it("Un utilisateur perdir de l'expérimentation doit pouvoir modifier une demande qui lui appartient dans les statuts proposition / brouillon / dossier incomplet", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.campagne2024();

    fixture.given.intentionEditable(DemandeStatutEnum["brouillon"]);
    fixture.when.canEditIntention();
    fixture.then.verifierCanEdit();

    fixture.given.intentionEditable(DemandeStatutEnum["proposition"]);
    fixture.when.canEditIntention();
    fixture.then.verifierCanEdit();

    fixture.given.intentionEditable(DemandeStatutEnum["dossier incomplet"]);
    fixture.when.canEditIntention();
    fixture.then.verifierCanEdit();
  });

  it("Un utilisateur expert région de l'expérimentation ne doit pas pouvoir delete une demande", () => {
    fixture.given.utilisateurRegionExpe();
    fixture.given.campagne2024();
    fixture.given.intentionEditable();

    fixture.when.canDeleteIntention();

    fixture.then.verifierCanNotDelete();
  });

  it("Un utilisateur admin régional de l'expérimentation doit pouvoir delete ses demandes", () => {
    fixture.given.utilisateurAdminRegionExpe();
    fixture.given.campagne2024();
    fixture.given.intentionEditable();

    fixture.when.canDeleteIntention();

    fixture.then.verifierCanDelete();
  });

  it("Un utilisateur perdir de l'expérimentation doit pouvoir delete ses demandes en proposition", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.campagne2024();
    fixture.given.intentionEditable(DemandeStatutEnum["proposition"]);

    fixture.when.canDeleteIntention();

    fixture.then.verifierCanDelete();
  });

  it("Un utilisateur admin région de l'expérimentation doit pouvoir effectuer une correction sur une demande validée", () => {
    fixture.given.utilisateurAdminRegionExpe();
    fixture.given.campagne2024();
    fixture.given.intentionValidee();

    fixture.when.canShowCorrectionButton();

    fixture.then.verifierCanShowCorrectionButton();
  });

  it("Un utilisateur admin région de l'expérimentation ne doit pas pouvoir effectuer une correction sur un projet de demande", () => {
    fixture.given.utilisateurAdminRegionExpe();
    fixture.given.campagne2024();
    fixture.given.intentionEditable();

    fixture.when.canShowCorrectionButton();

    fixture.then.verifierCanNotShowCorrectionButton();
  });

  it("Un utilisateur admin région de l'expérimentation ne doit pas pouvoir effectuer une correction sur un type de demande ajustement", () => {
    fixture.given.utilisateurAdminRegionExpe();
    fixture.given.campagne2024();
    fixture.given.intentionAjustement();

    fixture.when.canShowCorrectionButton();

    fixture.then.verifierCanNotShowCorrectionButton();
  });

});
