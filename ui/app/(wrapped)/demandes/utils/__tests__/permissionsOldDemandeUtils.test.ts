import type { Role} from 'shared';
import { RoleEnum } from 'shared';
import type { CampagneStatut} from 'shared/enum/campagneStatutEnum';
import { CampagneStatutEnum } from 'shared/enum/campagneStatutEnum';
import type { DemandeStatutType} from 'shared/enum/demandeStatutEnum';
import {DemandeStatutEnum} from 'shared/enum/demandeStatutEnum';
import {DemandeTypeEnum} from 'shared/enum/demandeTypeEnum';
import type { CampagneType } from "shared/schema/campagneSchema";
import type { UserType } from "shared/schema/userSchema";
import {beforeEach,describe, expect, it} from 'vitest';

import type { Demande } from '@/app/(wrapped)/demandes/utils/permissionsDemandeUtils';
import { canCorrectDemande, canCreateDemande, canDeleteDemande, canEditDemande, canImportDemande } from '@/app/(wrapped)/demandes/utils/permissionsDemandeUtils';

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

const createDemandeBuilder = ({
  campagne,
  statut,
  typeDemande,
  canEdit,
} : Demande): Demande => ({
  campagne,
  statut,
  typeDemande,
  canEdit,
  isOldDemande: true
});

const fixtureBuilder = () => {
  let user: UserType | undefined = undefined;
  let campagne: CampagneType = createCampagneBuilder({annee: "2023"});
  let demande: Demande = createDemandeBuilder({
    campagne: createCampagneBuilder({annee: "2023"}),
    statut: DemandeStatutEnum["projet de demande"],
    typeDemande: DemandeTypeEnum["ouverture_nette"],
    canEdit: true,
    isOldDemande: true
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
      utilisateurPerdir: () => {
        user = createUserBuilder({role: RoleEnum["perdir"], codeRegion: "76"});
      },
      utilisateurAdminRegion: () => {
        user = createUserBuilder({role: RoleEnum["admin_region"], codeRegion: "76"});
      },
      utilisateurRegion: () => {
        user = createUserBuilder({role: RoleEnum["expert_region"], codeRegion: "76"});
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
      campagne2025EnAttente: () => {
        campagne = createCampagneBuilder({annee: "2025", statut: CampagneStatutEnum["en attente"]});
      },
      campagneRegionaleEnCoursWithSaisiePerdir: () => {
        campagne = createCampagneBuilder({annee: "2025", codeRegion: "76", withSaisiePerdir: true});
      },
      campagneRegionaleEnCoursWithoutSaisiePerdir: () => {
        campagne = createCampagneBuilder({annee: "2025", codeRegion: "76", withSaisiePerdir: false });
      },
      demandeEditable: (statut?: DemandeStatutType) => {
        demande = createDemandeBuilder({
          campagne,
          statut: statut ?? DemandeStatutEnum["projet de demande"],
          typeDemande: DemandeTypeEnum["ouverture_nette"],
          canEdit: true,
          isOldDemande: true
        });
      },
      demandeNonEditable: (statut?: DemandeStatutType) => {
        demande = createDemandeBuilder({
          campagne,
          statut: statut ?? DemandeStatutEnum["projet de demande"],
          typeDemande: DemandeTypeEnum["ouverture_nette"],
          canEdit: false,
          isOldDemande: true
        });
      },
      demandeValidee: () => {
        demande = createDemandeBuilder({
          campagne,
          statut: DemandeStatutEnum["demande validée"],
          typeDemande: DemandeTypeEnum["ouverture_nette"],
          canEdit: true,
          isOldDemande: true
        });
      },
      demandeAjustement: () => {
        demande = createDemandeBuilder({
          campagne,
          statut: DemandeStatutEnum["projet de demande"],
          typeDemande: DemandeTypeEnum["ajustement"],
          canEdit: true,
          isOldDemande: true
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
      canDeleteDemande: () => {
        canDelete = canDeleteDemande({demande, user});
      },
      canImportDemande: () => {
        canImport = canImportDemande({isAlreadyImported: isAlreadyImported ?? false, isLoading: false, campagne, user});
      },
      canEditDemande:  () => {
        canEdit = canEditDemande( {demande, user});
      },
      canCreateDemande: () => {
        canCreate = canCreateDemande({campagne, user});
      },
      canShowCorrectionButton: () => {
        canShowCorrectionButton = canCorrectDemande({demande, user});
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


describe("ui > app > (wrapped) > demandes > utils > permissionsDemandeUtils", () => {
  let fixture: ReturnType<typeof fixtureBuilder>;

  beforeEach(() => {
    fixture = fixtureBuilder();
  });

  it("Un utilisateur national doit pouvoir importer une demande d'une campagne terminée", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne2023Terminee();
    fixture.given.demandeValidee();
    fixture.given.isNotAlreadyImported();

    fixture.when.canImportDemande();
    fixture.then.verifierCanImport();
  });

  it("Un utilisateur national ne doit pas pouvoir importer une demande d'une campagne terminée qui a déjà été importée", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne2023Terminee();
    fixture.given.demandeValidee();
    fixture.given.isAlreadyImported();

    fixture.when.canImportDemande();
    fixture.then.verifierCanNotImport();
  });

  it("Un utilisateur national ne doit pas pouvoir importer une demande d'une campagne non terminée", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne2023();
    fixture.given.demandeValidee();
    fixture.given.isNotAlreadyImported();

    fixture.when.canImportDemande();
    fixture.then.verifierCanNotImport();
  });

  it("Un utilisateur non connecté ne doit pas pouvoir importer une demande", () => {
    fixture.given.utilisateurAnonyme();
    fixture.given.campagne2023Terminee();
    fixture.given.demandeValidee();
    fixture.given.isNotAlreadyImported();

    fixture.when.canImportDemande();
    fixture.then.verifierCanNotImport();
  });

  it("Un utilisateur qui n'a pas les permissions ne doit pas pouvoir importer une demande ou modifier une demande", () => {
    fixture.given.utilisateurInvite();
    fixture.given.campagne2023Terminee();
    fixture.given.demandeValidee();
    fixture.given.isNotAlreadyImported();

    fixture.when.canImportDemande();
    fixture.then.verifierCanNotImport();

    fixture.when.canEditDemande( );
    fixture.then.verifierCanNotEdit();

    fixture.when.canCreateDemande();
    fixture.then.verifierCanNotCreate();

    fixture.when.canDeleteDemande();
    fixture.then.verifierCanNotDelete();

    fixture.when.canShowCorrectionButton();
    fixture.then.verifierCanNotShowCorrectionButton();
  });

  it("Un utilisateur national doit pouvoir modifier une demande", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne2024();
    fixture.given.demandeEditable();

    fixture.when.canEditDemande( );
    fixture.then.verifierCanEdit();

    fixture.when.canDeleteDemande();
    fixture.then.verifierCanDelete();
  });

  it("Un utilisateur national ne doit pas pouvoir modifier une demande non éditable", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne2024();
    fixture.given.demandeNonEditable();

    fixture.when.canEditDemande( );
    fixture.then.verifierCanNotEdit();
  });

  it("Un utilisateur national ne doit pas pouvoir créer ou modifier une demande pendant une campagne terminée", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne2023Terminee();
    fixture.given.demandeEditable();

    fixture.when.canEditDemande( );
    fixture.then.verifierCanNotEdit();

    fixture.when.canCreateDemande();
    fixture.then.verifierCanNotCreate();
  });

  it("Un utilisateur national ne doit pas pouvoir créer ou modifier une demande pendant une campagne en attente", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne2025EnAttente();
    fixture.given.demandeEditable();

    fixture.when.canEditDemande( );
    fixture.then.verifierCanNotEdit();

    fixture.when.canCreateDemande();
    fixture.then.verifierCanNotCreate();
  });

  it("Un utilisateur admin région doit pouvoir créer ou modifier une demande pendant la campagne 2024", () => {
    fixture.given.utilisateurAdminRegion();
    fixture.given.campagne2024();
    fixture.given.demandeEditable();

    fixture.when.canEditDemande( );
    fixture.then.verifierCanEdit();
  });

  it("Un utilisateur admin région doit pouvoir créer une demande pendant la campagne en cours si celle ci a une campagne régionale ", () => {
    fixture.given.utilisateurAdminRegion();
    fixture.given.campagneRegionaleEnCoursWithSaisiePerdir();

    fixture.when.canCreateDemande();
    fixture.then.verifierCanCreate();
  });

  it("Un utilisateur perdir doit pouvoir créer ou modifier une demande sur laquelle il a des droits", () => {
    fixture.given.utilisateurPerdir();
    fixture.given.campagne2024();
    fixture.given.demandeEditable();

    fixture.when.canEditDemande( );
    fixture.then.verifierCanEdit();

    fixture.when.canCreateDemande();
    fixture.then.verifierCanCreate();

    fixture.when.canDeleteDemande();
    fixture.then.verifierCanDelete();
  });

  it("Un utilisateur national doit pouvoir modifier une demande lors d'une campagne qui n'est pas la dernière en cours", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne2024();
    fixture.given.demandeEditable();

    fixture.when.canEditDemande( );
    fixture.then.verifierCanEdit();
  });

  it("Un utilisateur expert région ne doit pas pouvoir modifier une demande pour laquelle il n'a pas les droits", () => {
    fixture.given.utilisateurRegion();
    fixture.given.campagne2024();

    fixture.given.demandeNonEditable();
    fixture.when.canEditDemande( );
    fixture.then.verifierCanNotEdit();
  });

  it("Un utilisateur invité ne doit pas pouvoir modifier une demande pour laquelle il n'a pas les droits", () => {
    fixture.given.utilisateurInvite();
    fixture.given.campagne2024();

    fixture.given.demandeEditable();
    fixture.when.canEditDemande( );
    fixture.then.verifierCanNotEdit();
  });

  it("Un utilisateur anonyme ne doit pas pouvoir modifier une demande pour laquelle il n'a pas les droits", () => {
    fixture.given.utilisateurAnonyme();
    fixture.given.campagne2024();

    fixture.given.demandeEditable();
    fixture.when.canEditDemande( );
    fixture.then.verifierCanNotEdit();
  });

  it("Un utilisateur perdir région ne doit pas pouvoir delete une demande", () => {
    fixture.given.utilisateurRegion();
    fixture.given.campagne2024();
    fixture.given.demandeEditable();

    fixture.when.canDeleteDemande();

    fixture.then.verifierCanNotDelete();
  });

  it("Un utilisateur expert région ne doit pas pouvoir delete une demande", () => {
    fixture.given.utilisateurRegion();
    fixture.given.campagne2024();
    fixture.given.demandeEditable();

    fixture.when.canDeleteDemande();

    fixture.then.verifierCanNotDelete();
  });

  it("Un utilisateur admin région doit pouvoir delete ses demandes", () => {
    fixture.given.utilisateurAdminRegion();
    fixture.given.campagne2024();
    fixture.given.demandeEditable();

    fixture.when.canDeleteDemande();

    fixture.then.verifierCanDelete();
  });

  it("Un utilisateur admin région doit pouvoir effectuer une correction sur une demande validée", () => {
    fixture.given.utilisateurAdminRegion();
    fixture.given.campagne2023Terminee();
    fixture.given.demandeValidee();

    fixture.when.canShowCorrectionButton();

    fixture.then.verifierCanShowCorrectionButton();
  });

  it("Un utilisateur admin région ne doit pas pouvoir effectuer une correction sur un projet de demande", () => {
    fixture.given.utilisateurAdminRegion();
    fixture.given.campagne2023Terminee();
    fixture.given.demandeEditable();

    fixture.when.canShowCorrectionButton();

    fixture.then.verifierCanNotShowCorrectionButton();
  });

  it("Un utilisateur admin région ne doit pas pouvoir effectuer une correction sur un type de demande ajustement", () => {
    fixture.given.utilisateurAdminRegion();
    fixture.given.campagne2023Terminee();
    fixture.given.demandeAjustement();

    fixture.when.canShowCorrectionButton();

    fixture.then.verifierCanNotShowCorrectionButton();
  });

  it("Un utilisateur perdir ne doit pas pouvoir effectuer une correction sur une demande", () => {
    fixture.given.utilisateurPerdir();
    fixture.given.campagne2023Terminee();
    fixture.given.demandeValidee();

    fixture.when.canShowCorrectionButton();

    fixture.then.verifierCanNotShowCorrectionButton();
  });

  it("Un utilisateur expert région ne doit pas pouvoir effectuer une correction sur une demande", () => {
    fixture.given.utilisateurRegion();
    fixture.given.campagne2023Terminee();
    fixture.given.demandeValidee();

    fixture.when.canShowCorrectionButton();

    fixture.then.verifierCanNotShowCorrectionButton();
  });

  it("Un utilisateur admin région ne doit pas pouvoir effectuer une correction sur une demande d'une campagne en cours", () => {
    fixture.given.utilisateurAdminRegion();
    fixture.given.campagne2024();
    fixture.given.demandeValidee();

    fixture.when.canShowCorrectionButton();

    fixture.then.verifierCanNotShowCorrectionButton();
  });

  it("Un utilisateur admin région ne doit pas pouvoir effectuer une correction sur une demande d'une campagne en attente", () => {
    fixture.given.utilisateurAdminRegion();
    fixture.given.campagne2025EnAttente();
    fixture.given.demandeValidee();

    fixture.when.canShowCorrectionButton();

    fixture.then.verifierCanNotShowCorrectionButton();
  });

  it("Un utilisateur admin région ne doit pas pouvoir créer une demande ", () => {
    fixture.given.utilisateurAdminRegion();
    fixture.given.campagne2024();
    fixture.given.demandeEditable();

    fixture.when.canEditDemande( );

    fixture.then.verifierCanEdit();
  });

});
