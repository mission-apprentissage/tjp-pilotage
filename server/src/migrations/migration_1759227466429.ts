import type { Kysely } from "kysely";

import { refreshViews } from "@/modules/import/usecases/refreshViews/refreshViews.usecase";

export const up = async (db: Kysely<unknown>) => {
  //rectifier les demandes de MC vers CS
  await db.executeQuery(`
        UPDATE demande SET cfd = '56133002', "codeDispositif" = '257' WHERE cfd = '01033002' and statut = 'demande validée';
        UPDATE demande SET cfd = '46125510', "codeDispositif" = '258' WHERE cfd = '01025510' and statut = 'demande validée';
        UPDATE demande SET cfd = '46125509', "codeDispositif" = '258' WHERE cfd = '01025509' and statut = 'demande validée';
        UPDATE demande SET cfd = '56122111', "codeDispositif" = '257' WHERE cfd = '01022111' and statut = 'demande validée';
        UPDATE demande SET cfd = '46133501', "codeDispositif" = '258' WHERE cfd = '01033501' and statut = 'demande validée';
        UPDATE demande SET cfd = '46132601', "codeDispositif" = '258' WHERE cfd = '01032601' and statut = 'demande validée';
        UPDATE demande SET cfd = '56133605', "codeDispositif" = '257' WHERE cfd = '01033605' and statut = 'demande validée';
        UPDATE demande SET cfd = '46122704', "codeDispositif" = '258' WHERE cfd = '01022704' and statut = 'demande validée';
        UPDATE demande SET cfd = '56122105', "codeDispositif" = '257' WHERE cfd = '01022105' and statut = 'demande validée';
        UPDATE demande SET cfd = '01033002', "codeDispositif" = '253' WHERE cfd = '01033001' and statut = 'demande validée';
        UPDATE demande SET cfd = '46133502', "codeDispositif" = '258' WHERE cfd = '01033502' and statut = 'demande validée';
        UPDATE demande SET cfd = '46122705', "codeDispositif" = '258' WHERE cfd = '01022705' and statut = 'demande validée';
        UPDATE demande SET cfd = '46125406', "codeDispositif" = '258' WHERE cfd = '01025406' and statut = 'demande validée';
        UPDATE demande SET cfd = '46125508', "codeDispositif" = '258' WHERE cfd = '01025508' and statut = 'demande validée';
        UPDATE demande SET cfd = '46123306', "codeDispositif" = '258' WHERE cfd = '01023306' and statut = 'demande validée';
        UPDATE demande SET cfd = '46133413', "codeDispositif" = '258' WHERE cfd = '01033413' and statut = 'demande validée';
        UPDATE demande SET cfd = '56122109', "codeDispositif" = '257' WHERE cfd = '01022109' and statut = 'demande validée';
        UPDATE demande SET cfd = '56122307', "codeDispositif" = '257' WHERE cfd = '01022307' and statut = 'demande validée';
        UPDATE demande SET cfd = '56122103', "codeDispositif" = '257' WHERE cfd = '01022103' and statut = 'demande validée';
        UPDATE demande SET cfd = '56122112', "codeDispositif" = '257' WHERE cfd = '01022110' and statut = 'demande validée';
        UPDATE demande SET cfd = '46125312', "codeDispositif" = '258' WHERE cfd = '01025312' and statut = 'demande validée';
        UPDATE demande SET cfd = '46122001', "codeDispositif" = '258' WHERE cfd = '01022001' and statut = 'demande validée';
        UPDATE demande SET cfd = '56133411', "codeDispositif" = '257' WHERE cfd = '01033411' and statut = 'demande validée';
        UPDATE demande SET cfd = '56124201', "codeDispositif" = '257' WHERE cfd = '01024201' and statut = 'demande validée';
        UPDATE demande SET cfd = '46125123', "codeDispositif" = '258' WHERE cfd = '01025123' and statut = 'demande validée';
        UPDATE demande SET cfd = '46133412', "codeDispositif" = '258' WHERE cfd = '01033412' and statut = 'demande validée';
        UPDATE demande SET cfd = '56123307', "codeDispositif" = '257' WHERE cfd = '01023307' and statut = 'demande validée';
        UPDATE demande SET cfd = '46131101', "codeDispositif" = '258' WHERE cfd = '01031101' and statut = 'demande validée';
        UPDATE demande SET cfd = '46131201', "codeDispositif" = '258' WHERE cfd = '01031201' and statut = 'demande validée';
        UPDATE demande SET cfd = '46133503', "codeDispositif" = '258' WHERE cfd = '01033503' and statut = 'demande validée';
        UPDATE demande SET cfd = '56122304', "codeDispositif" = '257' WHERE cfd = '01022304' and statut = 'demande validée';
        UPDATE demande SET cfd = '46125122', "codeDispositif" = '258' WHERE cfd = '01025122' and statut = 'demande validée';
        UPDATE demande SET cfd = '46133414', "codeDispositif" = '258' WHERE cfd = '01033414' and statut = 'demande validée';
        UPDATE demande SET cfd = '46125002', "codeDispositif" = '258' WHERE cfd = '01025002' and statut = 'demande validée';
        UPDATE demande SET cfd = '46125408', "codeDispositif" = '258' WHERE cfd = '01025408' and statut = 'demande validée';
        UPDATE demande SET cfd = '46125407', "codeDispositif" = '258' WHERE cfd = '01025407' and statut = 'demande validée';
    `);

  refreshViews();
};

export const down = async (db: Kysely<unknown>) => {
  //pas de rollback possible car rectifications de données, donc rien

};
