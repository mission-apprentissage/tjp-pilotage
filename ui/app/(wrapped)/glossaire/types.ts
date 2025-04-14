import type { client } from "@/api.client";

export type GlossaireEntryWithKey = (typeof client.infer)["[GET]/glossaire"][0] & {
  key: string;
};

export type GlossaireEntries = (typeof client.infer)["[GET]/glossaire"];

export type GlossaireEntryContent = (typeof client.infer)["[GET]/glossaire/:slug"];
