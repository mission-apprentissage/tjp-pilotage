import { kdb } from "../../../../db/db";

// export const getAllDataEtablissements = ({
//   offset,
//   limit,
// }: {
//   offset: number;
//   limit: number;
// }) =>
//   kdb
//     .selectFrom("dataEtablissement")
//     .select("uai")
//     .distinct()
//     .offset(offset)
//     .limit(limit)
//     .execute();

export const getAllDataEtablissements = () =>
  kdb.selectFrom("dataEtablissement").select("uai").distinct().execute();
