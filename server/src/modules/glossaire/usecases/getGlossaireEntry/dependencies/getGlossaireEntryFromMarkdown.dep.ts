import { notFound } from "@hapi/boom";
import fs from "fs/promises";
import matter from "gray-matter";
import path from "path";
import type { GlossaireEntry } from "shared/routes/schemas/get.glossaire.id.schema";

import logger from "@/services/logger";

export async function getGlossaireEntryFromMarkdown(slug: string): Promise<GlossaireEntry> {
  const entriesDir = path.join(process.cwd(), "src/modules/glossaire/entries");
  const filePath = path.join(entriesDir, `${slug}.md`);

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      title: data.title || "",
      type: data["Type d'indicateur"] || "",
      createdBy: data["Created by"] || "",
      status: data.statut || "",
      content,
      icon: data.icon || "",
      slug,
    };
  } catch (error) {
    logger.error(error, `Entrée de glossaire non trouvée: ${slug}`);

    throw notFound(`Entrée de glossaire non trouvée: ${slug}`);
  }
}
