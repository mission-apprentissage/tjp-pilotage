import type { Role} from 'shared';
import { RoleEnum } from 'shared';
import type { DemandeStatutType } from 'shared/enum/demandeStatutEnum';
import { DemandeStatutEnum } from 'shared/enum/demandeStatutEnum';
import type { UserType } from "shared/schema/userSchema";
import {beforeEach,describe, expect, it} from 'vitest';

import {getPossibleNextStatuts} from '@/app/(wrapped)/intentions/utils/statutUtils';


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

const allPossibleStatuts = Object.values(DemandeStatutEnum)
  .filter((statut) =>
    statut !== DemandeStatutEnum["supprimée"] &&
    statut !== DemandeStatutEnum["brouillon"]
  );

const fixtureBuilder = () => {
  let statutPrecedent: DemandeStatutType | undefined = undefined;
  let user: UserType | undefined = undefined;

  let possibleNextStatuts: Array<DemandeStatutType> | undefined = undefined;

  return {
    given: {
      statutPrecedent: (statutPrecedentValue: DemandeStatutType) => {
        statutPrecedent = statutPrecedentValue;
      },
      utilisateurAdmin: () => {
        user = createUserBuilder({role: RoleEnum["admin_region"]});
      },
      utilisateurNonAdmin: () => {
        user = createUserBuilder({role: RoleEnum["gestionnaire_region"]});
      }
    },
    when: {
      getPossibleNextStatuts: () => {
        possibleNextStatuts = getPossibleNextStatuts({user, statut: statutPrecedent});
      },
    },
    then: {
      verifierNextStatuts: (possibleNextStatutsValue: Array<DemandeStatutType>) => {
        expect(possibleNextStatuts?.toSorted((a,b) => a.localeCompare(b)))
          .toEqual(possibleNextStatutsValue.toSorted((a,b) => a.localeCompare(b)));
      }
    },
  };
};


describe("ui > app > (wrapped) > intentions > utils > statutUtils", () => {
  let fixture: ReturnType<typeof fixtureBuilder>;

  beforeEach(() => {
    fixture = fixtureBuilder();
  });

  it("Tous les statuts possibles pour un utilisateur admin", () => {
    fixture.given.utilisateurAdmin();
    fixture.given.statutPrecedent(DemandeStatutEnum["demande validée"]);

    fixture.when.getPossibleNextStatuts();

    fixture.then.verifierNextStatuts(allPossibleStatuts);
  });

  it("Différents statuts possibles pour un utilisateur non admin ", () => {
    fixture.given.utilisateurNonAdmin();
    fixture.given.statutPrecedent(DemandeStatutEnum["proposition"]);
    fixture.when.getPossibleNextStatuts();
    fixture.then.verifierNextStatuts([
      DemandeStatutEnum["projet de demande"],
      DemandeStatutEnum["dossier complet"],
      DemandeStatutEnum["dossier incomplet"],
    ]);

    fixture.given.statutPrecedent(DemandeStatutEnum["projet de demande"]);
    fixture.when.getPossibleNextStatuts();
    fixture.then.verifierNextStatuts([
      DemandeStatutEnum["prêt pour le vote"],
    ]);

    fixture.given.statutPrecedent(DemandeStatutEnum["prêt pour le vote"]);
    fixture.when.getPossibleNextStatuts();
    fixture.then.verifierNextStatuts([
      DemandeStatutEnum["demande validée"],
      DemandeStatutEnum["refusée"],
    ]);

    fixture.given.statutPrecedent(DemandeStatutEnum["demande validée"]);
    fixture.when.getPossibleNextStatuts();
    fixture.then.verifierNextStatuts([]);

    fixture.given.statutPrecedent(DemandeStatutEnum["refusée"]);
    fixture.when.getPossibleNextStatuts();
    fixture.then.verifierNextStatuts([]);
  });

});
