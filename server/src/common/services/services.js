import config from "../../config.js";
import { createClamav } from "./clamav.js";
import { createMailer } from "./mailer/mailer.js";

const createServices = async (options = {}) => {
  return {
    mailer: options.mailer || createMailer(),
    clamav: options.clamav || (await createClamav(config.clamav.uri)),
  };
};

export default createServices;
