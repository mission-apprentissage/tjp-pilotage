import { renderFile } from "ejs";
import { inject } from "injecti";
import { omit } from "lodash-es";
import mjml from "mjml";
import { createTransport } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { htmlToText } from "nodemailer-html-to-text";
import path from "path";

import config from "@/config";
import { getStaticDirPath } from "@/utils/getStaticFilePath";

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
  intention_dossier_incomplet: {
    libelleFormation: string;
  };
};

function createTransporter(smtp: SMTPTransport & { secure: boolean }) {
  const needsAuthentication = !!smtp.auth?.user;
  const transporter = createTransport(needsAuthentication ? smtp : omit(smtp, ["auth"]));
  transporter.use("compile", htmlToText());
  return transporter;
}

export const [shootEmail] = inject(
  //@ts-ignore
  { transporter: createTransporter({ ...config.smtp, secure: false }) },
  (deps) =>
    async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
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
    templateFile: path.join(getStaticDirPath(), `/mails/${template}.mjml.ejs`),
  });

  await shootEmail({ html, subject, to });
};

function getPublicUrl(filepath: string) {
  return `${config.publicUrl}${filepath}`;
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
  const buffer = await renderFile(templateFile, {
    to,
    subject,
    data,
    utils: { getPublicUrl },
  });

  const { html } = mjml(buffer.toString(), {});
  return html;
}
