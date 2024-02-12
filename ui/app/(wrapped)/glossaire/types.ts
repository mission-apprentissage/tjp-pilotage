import { client } from "../../../api.client";

export type GlossaireEntryWithKey =
  (typeof client.infer)["[GET]/glossaire"][0] & {
    key: string;
  };

export type GlossaireEntry = (typeof client.infer)["[GET]/glossaire"];

export type GlossaireEntryContent =
  (typeof client.infer)["[GET]/glossaire/:id"];
