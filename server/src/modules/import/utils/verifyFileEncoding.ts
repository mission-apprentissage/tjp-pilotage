import { pipeline, Writable } from "node:stream";

import fs from "fs";
import { detect } from "jschardet";

const checkUTF8BOM = async (filePath: string) => {
  const chunks = [];
  for await (const chunk of fs.createReadStream(filePath, {
    start: 0,
    end: 2,
  })) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);

  // Si le buffer commence par 0xef, 0xbb et 0xbf, cela signifie que
  // la BOM UTF-8 est présente et que le fichier est correctement encodé en UTF-8
  return buffer.compare(Buffer.from([0xef, 0xbb, 0xbf])) > -1;
};

export const verifyFileEncoding = async (filePath: string) => {
  const hasUTF8BOM = await checkUTF8BOM(filePath);
  if (hasUTF8BOM) {
    return;
  }

  const encodingPredictions: { [encoding: string]: number } = {};

  const stream = pipeline(
    fs.createReadStream(filePath),
    new Writable({
      final: async (callback) => {
        callback();
      },
      objectMode: true,
      decodeStrings: false,
      write: async (line, _, callback) => {
        const encodingPrediction = detect(line);

        if (!encodingPredictions[encodingPrediction.encoding]) {
          encodingPredictions[encodingPrediction.encoding] = 0;
        }

        encodingPredictions[encodingPrediction.encoding] +=
          encodingPrediction.confidence;

        callback();
      },
    }),
    (err) => {
      if (err) {
        throw err;
      }
    }
  );

  const promise = new Promise<void>((resolve, reject) => {
    stream.on("error", (err) => {
      reject(err);
    });
    stream.on("finish", () => {
      resolve();
    });
  });

  await promise;

  const highestScoreEncoding = Object.keys(encodingPredictions).reduce(
    (a, b) => (encodingPredictions[a] > encodingPredictions[b] ? a : b)
  );

  if (highestScoreEncoding !== "UTF-8") {
    throw new Error(
      `Le fichier ${filePath} n'est pas correctement encodé en UTF-8. Veuillez le ré-encoder ou le sauvegarder sour le format UTF-8 (BOM).`
    );
  }
};
