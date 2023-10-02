import ejs from "ejs";
import { inject } from "injecti";
import _ from "lodash";
import mjml from "mjml";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { htmlToText } from "nodemailer-html-to-text";
import path from "path";

import { config } from "../../../../../config/config";
import { basepath } from "../../../../basepath";

export type TemplatePayloads = {
  reset_password: {
    recipient: {
      lastname?: string | undefined;
      firstname?: string | undefined;
      email: string;
    };
    resetPasswordToken: string;
  };
  activate_account: {
    recipient: {
      lastname?: string | undefined;
      firstname?: string | undefined;
      email: string;
      role: string;
    };
    activationToken: string;
  };
  activate_account_pilote: {
    recipient: {
      lastname?: string | undefined;
      firstname?: string | undefined;
      email: string;
      role: string;
    };
    activationToken: string;
  };
  activate_account_region: {
    recipient: {
      lastname?: string | undefined;
      firstname?: string | undefined;
      email: string;
      role: string;
    };
    activationToken: string;
  };
};

function createTransporter(smtp: SMTPTransport & { secure: boolean }) {
  const needsAuthentication = !!smtp.auth?.user;
  const transporter = nodemailer.createTransport(
    needsAuthentication ? smtp : _.omit(smtp, ["auth"])
  );
  transporter.use("compile", htmlToText());
  return transporter;
}

export const [shootEmail] = inject(
  //@ts-ignore
  { transporter: createTransporter({ ...config.smtp, secure: false }) },
  (deps) =>
    async ({
      to,
      subject,
      html,
    }: {
      to: string;
      subject: string;
      html: string;
    }) => {
      const { messageId } = await deps.transporter.sendMail({
        from: config.smtp.email_from,
        to,
        subject,
        html,
      });

      return messageId;
    }
);

export const shootTemplate = async <T extends keyof TemplatePayloads>({
  to,
  subject,
  template,
  data,
}: {
  to: string;
  subject: string;
  template: T;
  data: TemplatePayloads[T];
}) => {
  const html = await generateHtml({
    to,
    data,
    subject,
    templateFile: path.join(basepath, `/mails/${template}.mjml.ejs`),
  });

  await shootEmail({ html, subject, to });
};

function getPublicUrl(filepath: string) {
  return `${config.frontUrl}${filepath}`;
}

async function generateHtml({
  to,
  subject,
  templateFile,
  data,
}: {
  to: string;
  subject: string;
  templateFile: string;
  data: unknown;
}) {
  const buffer = await ejs.renderFile(templateFile, {
    to,
    subject,
    data,
    utils: { getPublicUrl },
  });

  const { html } = mjml(buffer.toString(), {});
  return html;
}
