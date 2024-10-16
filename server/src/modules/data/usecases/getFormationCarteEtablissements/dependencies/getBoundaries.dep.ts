import { getKbdClient } from "@/db/db";

export const getBoundaries = ({
  codeRegion,
  codeDepartement,
  codeAcademie,
}: {
  codeRegion?: string;
  codeDepartement?: string;
  codeAcademie?: string;
}) =>
  getKbdClient()
    .selectFrom("etablissement")
    .select((sb) => [
      sb.fn.coalesce(sb.fn.min("latitude"), sb.val(0)).as("latMin"),
      sb.fn.coalesce(sb.fn.max("latitude"), sb.val(0)).as("latMax"),
      sb.fn.coalesce(sb.fn.min("longitude"), sb.val(0)).as("lngMin"),
      sb.fn.coalesce(sb.fn.max("longitude"), sb.val(0)).as("lngMax"),
    ])
    .$call((qb) => {
      if (!codeRegion && !codeDepartement && !codeAcademie) {
        qb = qb.where((wb) => wb.and([wb("codeRegion", ">=", "11"), wb("codeRegion", "<=", "93")]));
      }

      if (codeRegion) {
        qb = qb.where("codeRegion", "=", codeRegion);
      }
      if (codeDepartement) {
        qb = qb.where("codeDepartement", "=", codeDepartement);
      }
      if (codeAcademie) {
        qb = qb.where("codeAcademie", "=", codeAcademie);
      }

      return qb;
    })
    .executeTakeFirstOrThrow();
