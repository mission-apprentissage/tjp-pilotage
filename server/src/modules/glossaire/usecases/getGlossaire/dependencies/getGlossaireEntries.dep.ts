import fs from "fs/promises";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import matter from "gray-matter";
import path from "path";
import type { GlossaireEntry } from "shared/routes/schemas/get.glossaire.schema";

import config from "@/config";
import logger from "@/services/logger";

export async function getGlossaireEntries(): Promise<GlossaireEntry[]> {
  try {
    const entriesDir = path.join(process.cwd(), config.env === "test" ? "server/src/modules/glossaire/entries" : "src/modules/glossaire/entries");
    const files = await fs.readdir(entriesDir);

    const entries = await Promise.all(
      files
        .filter((file) => file.endsWith(".md"))
        .map(async (file) => {
          const filePath = path.join(entriesDir, file);
          const fileContent = await fs.readFile(filePath, "utf-8");
          const { data } = matter(fileContent);
          const slug = path.basename(file, ".md");

          return {
            title: data.title ?? "",
            type: data["Type d'indicateur"] ?? "",
            createdBy: data["Created by"] ?? "",
            status: data.statut ?? "",
            icon: data.icon?.trim(),
            slug,
          } as GlossaireEntry;
        })
    );

    return entries.filter((entry) => entry.status === "validé").sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    logger.error(error, "Error while getting glossaire entries");
    return [];
  }
}
