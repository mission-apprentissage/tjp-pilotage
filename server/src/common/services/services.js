import { createMailer } from "./mailer/mailer.js";

const createServices = async (options = {}) => {
  return {
    mailer: options.mailer || createMailer(),
  };
};

export default createServices;
