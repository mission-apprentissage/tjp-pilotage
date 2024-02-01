import NodeCache from "node-cache";

import { config } from "../../../config/config";
import { Server } from "../../server";
import { getGlossaireRoute } from "./usecases/getGlossaire/getGlossaire.route";
import { getGlossaireEntryRoute } from "./usecases/getGlossaireEntry/getGlossaireEntry.route";

const UNE_MINUTE_EN_SECONDES = 60;
const DIX_MINUTES_EN_SECONDES = 10 * UNE_MINUTE_EN_SECONDES;

const glossaireCache = new NodeCache({
  stdTTL: config.env === "production" ? DIX_MINUTES_EN_SECONDES : undefined,
});

export const registerGlossaireModule = ({ server }: { server: Server }) => ({
  ...getGlossaireRoute({ server, cache: glossaireCache }),
  ...getGlossaireEntryRoute({ server, cache: glossaireCache }),
});
