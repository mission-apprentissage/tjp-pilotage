import uuid from "uuid";
import { createMailer } from "../../src/common/services/mailer/mailer.js";

function stubbedTransporter(options = {}) {
  const calls = options.calls || [];

  return {
    sendMail: (...args) => {
      if (options.fail) {
        throw new Error("Unable to send email");
      }

      calls.push(args[0]);
      return Promise.resolve({ messageId: uuid.v4() });
    },
  };
}

export function createFakeMailer(options) {
  const transporter = stubbedTransporter(options);
  return createMailer(transporter);
}
