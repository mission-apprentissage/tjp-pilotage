import { rawDataRepository } from "../../repositories/rawData.repository";

export const findUAIsApprentissage = ({ cfd }: { cfd: string }) => {
  return rawDataRepository
    .findRawDatas({
      type: "offres_apprentissage",
      filter: {
        "Code du diplome ou du titre suivant la nomenclature de l'Education nationale (CodeEN)":
          cfd,
      },
    })
    .then((rawDatas) => {
      if (!rawDatas || !rawDatas.length) return;
      return rawDatas
        .filter(
          (rawData) =>
            rawData["Tags"].includes("2023") || rawData["Tags"].includes("2024")
        )
        .map((rawData) => {
          if (rawData["UAI formation"]) return rawData["UAI formation"];
          if (rawData["UAI formateur"]) return rawData["UAI formateur"];
          return rawData["UAI Responsable"]!;
        })
        .filter((uai) => uai);
    });

  // const items = kdb
  //   .selectFrom("rawData")
  //   .select("rawData.data")
  //   .where("type", "=", "offres_apprentissage")
  //   .where(
  //     "data",
  //     "@>",
  //     sql`{"Code du diplome ou du titre suivant la nomenclature de l'Education nationale (CodeEN)": ${cfd}}`
  //   )
  //   .where((eb) =>
  //     eb.and([
  //       eb.or([
  //         eb(sql`"data"->>'Niveau de la formation'`, "like", "3%"),
  //         eb(sql`"data"->>'Niveau de la formation'`, "like", "4%"),
  //         eb(sql`"data"->>'Niveau de la formation'`, "like", "5%"),
  //       ]),
  //       eb.or([
  //         eb(sql`"data"->>'Tags'`, "like", "%2023%"),
  //         eb(sql`"data"->>'Tags'`, "like", "%2024%"),
  //       ]),
  //       eb(
  //         "data",
  //         "@>",
  //         sql`{"Code du diplome ou du titre suivant la nomenclature de l'Education nationale (CodeEN)": ${cfd}}`
  //       ),
  //     ])
  //   )
  //   .orderBy("id", "asc")
  //   .execute()
  //   .then((items) => items.map((item) => item.data as Offres_apprentissage));

  // return items.then((rawDatas) => {
  //   if (!rawDatas || !rawDatas.length) return;
  //   return rawDatas
  //     .map((rawData) => {
  //       if (rawData["UAI formation"]) return rawData["UAI formation"];
  //       if (rawData["UAI formateur"]) return rawData["UAI formateur"];
  //       return rawData["UAI Responsable"];
  //     })
  //     .filter((uai) => uai);
  // });
};
