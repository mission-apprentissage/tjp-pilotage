import { createMailer } from "./mailer/mailer";

export function async(options = {}) {
  return {
    mailer: options.mailer || createMailer(),
  };
}
