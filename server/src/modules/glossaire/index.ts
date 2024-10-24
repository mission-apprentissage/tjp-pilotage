import NodeCache from "node-cache";

import { config } from "../../../config/config";
import { Server } from "../../server";
import { getGlossaireRoute } from "./usecases/getGlossaire/getGlossaire.route";
import { getGlossaireEntryRoute } from "./usecases/getGlossaireEntry/getGlossaireEntry.route";

const UNE_MINUTE_EN_SECONDES = 60;

const glossaireCache = new NodeCache({
  stdTTL: config.env === "production" ? UNE_MINUTE_EN_SECONDES : undefined,
});

export const registerGlossaireModule = ({ server }: { server: Server }) => ({
  ...getGlossaireRoute({ server, cache: glossaireCache }),
  ...getGlossaireEntryRoute({ server, cache: glossaireCache }),
});
