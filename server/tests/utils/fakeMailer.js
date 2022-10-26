import { v4 as uuidv4 } from "uuid";
import { createMailerService } from "../../src/common/services/mailer.js";

function stubbedTransporter(options = {}) {
  const calls = options.calls || [];

  return {
    sendMail: (...args) => {
      if (options.fail) {
        throw new Error("Unable to send email");
      }

      calls.push(args[0]);
      return Promise.resolve({ messageId: uuidv4() });
    },
  };
}

export function createFakeMailer(options) {
  const transporter = stubbedTransporter(options);
  return createMailerService(transporter);
}
