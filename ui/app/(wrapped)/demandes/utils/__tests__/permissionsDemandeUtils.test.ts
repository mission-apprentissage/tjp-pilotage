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
  isOldDemande = false
} : Demande): Demande => ({
  campagne,
  statut,
  typeDemande,
  canEdit,
  isOldDemande
});

const fixtureBuilder = () => {
  let user: UserType | undefined = undefined;
  let campagne: CampagneType = createCampagneBuilder({annee: "2023"});
  let demande: Demande = createDemandeBuilder({
    campagne: createCampagneBuilder({annee: "2023"}),
    statut: DemandeStatutEnum["projet de demande"],
    typeDemande: DemandeTypeEnum["ouverture_nette"],
    canEdit: true,
    isOldDemande: false
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
      utilisateurExpert: () => {
        user = createUserBuilder({role: RoleEnum["expert_region"]});
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
      utilisateurExpertRegionExpe: () => {
        user = createUserBuilder({role: RoleEnum["expert_region"], codeRegion: "76"});
      },
      utilisateurExpertRegionHorsExpe: () => {
        user = createUserBuilder({role: RoleEnum["expert_region"], codeRegion: "11"});
      },
      utilisateurGestionnaireRegionExpe: () => {
        user = createUserBuilder({role: RoleEnum["gestionnaire_region"], codeRegion: "76"});
      },
      utilisateurGestionnaireRegionHorsExpe: () => {
        user = createUserBuilder({role: RoleEnum["gestionnaire_region"], codeRegion: "11"});
      },
      campagne: (annee: string, statut?: CampagneStatut) => {
        campagne = createCampagneBuilder({annee, statut: statut ?? CampagneStatutEnum["en cours"]});
      },
      demandeEditable: (statut?: DemandeStatutType, isOldDemande: boolean = false) => {
        demande = createDemandeBuilder({
          campagne,
          statut: statut ?? DemandeStatutEnum["projet de demande"],
          typeDemande: DemandeTypeEnum["ouverture_nette"],
          canEdit: true,
          isOldDemande
        });
      },
      demandeNonEditable: (statut?: DemandeStatutType, isOldDemande: boolean = false) => {
        demande = createDemandeBuilder({
          campagne,
          statut: statut ?? DemandeStatutEnum["projet de demande"],
          typeDemande: DemandeTypeEnum["ouverture_nette"],
          canEdit: false,
          isOldDemande
        });
      },
      demandeValidee: (isOldDemande: boolean = false) => {
        demande = createDemandeBuilder({
          campagne,
          statut: DemandeStatutEnum["demande validée"],
          typeDemande: DemandeTypeEnum["ouverture_nette"],
          canEdit: true,
          isOldDemande
        });
      },
      demandeAjustement: (isOldDemande: boolean = false) => {
        demande = createDemandeBuilder({
          campagne,
          statut: DemandeStatutEnum["projet de demande"],
          typeDemande: DemandeTypeEnum["ajustement"],
          canEdit: true,
          isOldDemande
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
        canImport = canImportDemande({
          isAlreadyImported: isAlreadyImported ?? false,
          isLoading: false,
          campagne,
          user
        });
      },
      canEditDemande: () => {
        canEdit = canEditDemande({demande, user});
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
    fixture.given.campagne("2023", CampagneStatutEnum["terminée"]);
    fixture.given.demandeValidee();
    fixture.given.isNotAlreadyImported();

    fixture.when.canImportDemande();
    fixture.then.verifierCanImport();
  });

  it("Un utilisateur national ne doit pas pouvoir importer une demande d'une campagne terminée qui a déjà été importée", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne("2023", CampagneStatutEnum["terminée"]);
    fixture.given.demandeValidee();
    fixture.given.isAlreadyImported();

    fixture.when.canImportDemande();
    fixture.then.verifierCanNotImport();
  });

  it("Un utilisateur national ne doit pas pouvoir importer une demande d'une campagne non terminée", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne("2023");
    fixture.given.demandeValidee();
    fixture.given.isNotAlreadyImported();

    fixture.when.canImportDemande();
    fixture.then.verifierCanNotImport();
  });

  it("Un utilisateur non connecté ne doit pas pouvoir importer une demande", () => {
    fixture.given.utilisateurAnonyme();
    fixture.given.campagne("2023", CampagneStatutEnum["terminée"]);
    fixture.given.demandeValidee();
    fixture.given.isNotAlreadyImported();

    fixture.when.canImportDemande();
    fixture.then.verifierCanNotImport();
  });

  it("Un utilisateur expert ne doit pas pouvoir créer ou modifier une demande dans la campagne 2024", () => {
    fixture.given.utilisateurExpert();
    fixture.given.campagne("2024");

    fixture.when.canCreateDemande();
    fixture.then.verifierCanNotCreate();

    fixture.given.demandeEditable();
    fixture.when.canEditDemande();
    fixture.then.verifierCanNotEdit();
  });

  it("Un utilisateur expert ne doit pas pouvoir créer ou modifier une demande dans la campagne 2025", () => {
    fixture.given.utilisateurExpert();
    fixture.given.campagne("2025");

    fixture.when.canCreateDemande();
    fixture.then.verifierCanNotCreate();

    fixture.given.demandeEditable();
    fixture.when.canEditDemande();
    fixture.then.verifierCanNotEdit();
  });

  it("Un utilisateur qui n'a pas les permissions ne doit pas pouvoir importer une demande ou modifier une demande", () => {
    fixture.given.utilisateurInvite();
    fixture.given.campagne("2023", CampagneStatutEnum["terminée"]);
    fixture.given.demandeValidee();
    fixture.given.isNotAlreadyImported();

    fixture.when.canImportDemande();
    fixture.then.verifierCanNotImport();

    fixture.when.canEditDemande();
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
    fixture.given.campagne("2024");
    fixture.given.demandeEditable();

    fixture.when.canEditDemande();
    fixture.then.verifierCanEdit();

    fixture.when.canDeleteDemande();
    fixture.then.verifierCanDelete();
  });

  it("Un utilisateur national ne doit pas pouvoir modifier une demande non éditable", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne("2024");
    fixture.given.demandeNonEditable();

    fixture.when.canEditDemande();
    fixture.then.verifierCanNotEdit();
  });

  it("Un utilisateur national ne doit pas pouvoir créer ou modifier une demande pendant une campagne terminée", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne("2023", CampagneStatutEnum["terminée"]);
    fixture.given.demandeEditable();

    fixture.when.canEditDemande();
    fixture.then.verifierCanNotEdit();

    fixture.when.canCreateDemande();
    fixture.then.verifierCanNotCreate();
  });

  it("Un utilisateur national ne doit pas pouvoir créer ou modifier une demande pendant une campagne en attente", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne("2025", CampagneStatutEnum["en attente"]);
    fixture.given.demandeEditable();

    fixture.when.canEditDemande();
    fixture.then.verifierCanNotEdit();

    fixture.when.canCreateDemande();
    fixture.then.verifierCanNotCreate();
  });

  it("Un utilisateur admin région hors expérimentation doit pouvoir créer ou modifier une demande pendant la campagne 2024", () => {
    fixture.given.utilisateurAdminRegionHorsExpe();
    fixture.given.campagne("2024");
    fixture.given.demandeEditable();

    fixture.when.canEditDemande();
    fixture.then.verifierCanEdit();

    fixture.when.canCreateDemande();
    fixture.then.verifierCanCreate();
  });

  it("Un utilisateur gestionnaire hors expérimentation doit pouvoir créer ou modifier une demande pendant la campagne 2024", () => {
    fixture.given.utilisateurGestionnaireRegionHorsExpe();
    fixture.given.campagne("2024");
    fixture.given.demandeEditable();

    fixture.when.canEditDemande();
    fixture.then.verifierCanEdit();

    fixture.when.canCreateDemande();
    fixture.then.verifierCanCreate();
  });

  it("Un utilisateur expert hors expérimentation ne doit pas pouvoir créer ou modifier une demande pendant la campagne 2024", () => {
    fixture.given.utilisateurExpertRegionHorsExpe();
    fixture.given.campagne("2024");
    fixture.given.demandeEditable();

    fixture.when.canEditDemande();
    fixture.then.verifierCanNotEdit();

    fixture.when.canCreateDemande();
    fixture.then.verifierCanNotCreate();
  });

  it("Un utilisateur perdir hors expérimentation ne doit pas pouvoir créer ou modifier une demande pendant la campagne 2024", () => {
    fixture.given.utilisateurPerdirHorsExpe();
    fixture.given.campagne("2024");
    fixture.given.demandeEditable();

    fixture.when.canEditDemande();
    fixture.then.verifierCanNotEdit();

    fixture.when.canCreateDemande();
    fixture.then.verifierCanNotCreate();
  });

  it("Un utilisateur admin région de l'expérimentation doit pouvoir modifier une demande pendant une campagne nationale", () => {
    fixture.given.utilisateurAdminRegionExpe();
    fixture.given.campagne("2024");
    fixture.given.demandeEditable();

    fixture.when.canEditDemande();
    fixture.then.verifierCanEdit();
  });

  it("Un utilisateur admin région de l'expérimentation ne doit pas pouvoir créer une demande pendant une campagne nationale sans campagne régionale associée (hors 2023/2024)", () => {
    fixture.given.utilisateurAdminRegionExpe();
    fixture.given.campagne("2025");

    fixture.when.canCreateDemande();
    fixture.then.verifierCanNotCreate();
  });

  it("Un utilisateur admin région de l'expérimentation doit pouvoir modifier une demande pendant une campagne nationale", () => {
    fixture.given.utilisateurAdminRegionExpe();
    fixture.given.campagne("2024");
    fixture.given.demandeEditable();

    fixture.when.canEditDemande();
    fixture.then.verifierCanEdit();
  });

  it("Un utilisateur admin région de l'expérimentation doit pouvoir créer une demande pendant la campagne 2024 si la campagne 2025 est ouverte", () => {
    fixture.given.utilisateurAdminRegionExpe();
    fixture.given.campagne("2024");

    fixture.when.canCreateDemande();
    fixture.then.verifierCanCreate();
  });

  it("Un utilisateur admin région de l'expérimentation doit pouvoir créer une demande pendant la campagne en cours si celle ci a une campagne régionale ", () => {
    fixture.given.utilisateurAdminRegionExpe();
    fixture.given.campagne("2024");

    fixture.when.canCreateDemande();
    fixture.then.verifierCanCreate();
  });

  it("Un utilisateur perdir de l'expérimentation ne doit pas pouvoir modifier une demande qui lui appartient dans les statuts projet de demande / prêt pour le vote / dossier complet / demande validée / refusée", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.campagne("2024");

    fixture.given.demandeEditable(DemandeStatutEnum["projet de demande"]);
    fixture.when.canEditDemande();
    fixture.then.verifierCanNotEdit();

    fixture.given.demandeEditable(DemandeStatutEnum["prêt pour le vote"]);
    fixture.when.canEditDemande();
    fixture.then.verifierCanNotEdit();

    fixture.given.demandeEditable(DemandeStatutEnum["dossier complet"]);
    fixture.when.canEditDemande();
    fixture.then.verifierCanNotEdit();

    fixture.given.demandeEditable(DemandeStatutEnum["demande validée"]);
    fixture.when.canEditDemande();
    fixture.then.verifierCanNotEdit();

    fixture.given.demandeEditable(DemandeStatutEnum["refusée"]);
    fixture.when.canEditDemande();
    fixture.then.verifierCanNotEdit();
  });

  it("Un utilisateur perdir de l'expérimentation doit pouvoir modifier une demande qui lui appartient dans les statuts proposition / brouillon / dossier incomplet", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.campagne("2024");

    fixture.given.demandeEditable(DemandeStatutEnum["brouillon"]);
    fixture.when.canEditDemande();
    fixture.then.verifierCanEdit();

    fixture.given.demandeEditable(DemandeStatutEnum["proposition"]);
    fixture.when.canEditDemande();
    fixture.then.verifierCanEdit();

    fixture.given.demandeEditable(DemandeStatutEnum["dossier incomplet"]);
    fixture.when.canEditDemande();
    fixture.then.verifierCanEdit();
  });

  it("Un utilisateur national doit pouvoir créer et modifier une demande lors d'une campagne qui n'est pas la dernière en cours", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne("2024");
    fixture.given.demandeEditable();

    fixture.when.canCreateDemande();
    fixture.then.verifierCanCreate();

    fixture.when.canEditDemande();
    fixture.then.verifierCanEdit();
  });

  it("Un utilisateur expert région de l'expérimentation ne doit pas pouvoir delete une demande", () => {
    fixture.given.utilisateurExpertRegionExpe();
    fixture.given.campagne("2024");
    fixture.given.demandeEditable();

    fixture.when.canDeleteDemande();

    fixture.then.verifierCanNotDelete();
  });

  it("Un utilisateur admin régional de l'expérimentation doit pouvoir delete ses demandes", () => {
    fixture.given.utilisateurAdminRegionExpe();
    fixture.given.campagne("2024");
    fixture.given.demandeEditable();

    fixture.when.canDeleteDemande();

    fixture.then.verifierCanDelete();
  });

  it("Un utilisateur perdir de l'expérimentation doit pouvoir delete ses demandes en proposition", () => {
    fixture.given.utilisateurPerdirExpe();
    fixture.given.campagne("2024", CampagneStatutEnum["en cours"]);
    fixture.given.demandeEditable(DemandeStatutEnum["proposition"]);

    fixture.when.canDeleteDemande();

    fixture.then.verifierCanDelete();
  });

  it("Un utilisateur admin région de l'expérimentation doit pouvoir effectuer une correction sur une demande validée", () => {
    fixture.given.utilisateurAdminRegionExpe();
    fixture.given.campagne("2023", CampagneStatutEnum["terminée"]);
    fixture.given.demandeValidee();

    fixture.when.canShowCorrectionButton();

    fixture.then.verifierCanShowCorrectionButton();
  });

  it("Un utilisateur admin région de l'expérimentation ne doit pas pouvoir effectuer une correction sur un projet de demande", () => {
    fixture.given.utilisateurAdminRegionExpe();
    fixture.given.campagne("2023", CampagneStatutEnum["terminée"]);
    fixture.given.demandeEditable();

    fixture.when.canShowCorrectionButton();

    fixture.then.verifierCanNotShowCorrectionButton();
  });

  it("Un utilisateur admin région de l'expérimentation ne doit pas pouvoir effectuer une correction sur un type de demande ajustement", () => {
    fixture.given.utilisateurAdminRegionExpe();
    fixture.given.campagne("2023", CampagneStatutEnum["terminée"]);
    fixture.given.demandeAjustement();

    fixture.when.canShowCorrectionButton();

    fixture.then.verifierCanNotShowCorrectionButton();
  });

  it("Un utilisateur admin région de l'expérimentation ne doit pas pouvoir effectuer une correction sur une demande d'une campagne en cours", () => {
    fixture.given.utilisateurAdminRegionExpe();
    fixture.given.campagne("2024");
    fixture.given.demandeValidee();

    fixture.when.canShowCorrectionButton();

    fixture.then.verifierCanNotShowCorrectionButton();
  });

  it("Un utilisateur admin région de l'expérimentation ne doit pas pouvoir effectuer une correction sur une demande d'une campagne en attente", () => {
    fixture.given.utilisateurAdminRegionExpe();
    fixture.given.campagne("2025", CampagneStatutEnum["en attente"]);
    fixture.given.demandeValidee();

    fixture.when.canShowCorrectionButton();

    fixture.then.verifierCanNotShowCorrectionButton();
  });

  it("Un utilisateur admin région de l'expérimentation doit pouvoir éditer une demande d'une campagne en cours", () => {
    fixture.given.utilisateurAdminRegionExpe();
    fixture.given.campagne("2024");
    fixture.given.demandeEditable();

    fixture.when.canCreateDemande();
    fixture.when.canEditDemande();

    fixture.then.verifierCanCreate();
    fixture.then.verifierCanEdit();
  });

  it("Un utilisateur national doit pouvoir éditer une demande d'une campagne en cours", () => {
    fixture.given.utilisateurNational();
    fixture.given.campagne("2025");
    fixture.given.demandeEditable();

    fixture.when.canCreateDemande();
    fixture.when.canEditDemande();

    fixture.then.verifierCanCreate();
    fixture.then.verifierCanEdit();
  });

});
