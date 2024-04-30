import fs from "node:fs";

import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { FileManager } from "../../../core/services/fileManager/fileManager";
import { FilePathManager } from "../../../core/services/filePathManager/filePathManager";
import {
  BodyProperty,
  demandeSchema,
  submitDemandeSchema,
} from "./submitDemande.schema";
import { submitDemande } from "./submitDemande.usecase";

// const pump = util.promisify(pipeline);

type Body = {
  datas: BodyProperty;
  [key: string]: BodyProperty;
};

export const submitDemandeRoute = (
  server: Server,
  fileManager: FileManager,
  filePathManager: FilePathManager
) =>
  createRoute("/demande/submit", {
    method: "POST",
    schema: submitDemandeSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { datas, ...files } = request.body as Body;

        const demande = demandeSchema.parse(JSON.parse(datas.value ?? ""));

        const result = await submitDemande({
          demande: demande,
          user: request.user!,
        });

        if (result?.id) {
          for await (const file of Object.values(files)) {
            if (file.type === "file" && file?.toBuffer?.() && file.filename) {
              const buffer = await file.toBuffer();

              fileManager.uploadFile(
                filePathManager.getIntentionFilePath(result?.id, file.filename),
                buffer
              );

              fs.writeFileSync(`public/upload/${file.filename}`, buffer);
            }
          }
        }

        response.status(200).send(result);
      },
    });
  });
