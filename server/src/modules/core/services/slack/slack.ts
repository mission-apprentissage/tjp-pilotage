import type { Block, KnownBlock } from "@slack/bolt";
import { App } from "@slack/bolt";

import config from "@/config";

export const sendToSlack = async (main: (Block | KnownBlock)[], answer?: (Block | KnownBlock)[]) => {
  if (!config.slack.chanel) return;

  const slack = new App({
    token: config.slack.token,
    signingSecret: config.slack.signingSecret ?? "",
  });

  const sent = await slack.client.chat.postMessage({
    text: "",
    blocks: main,
    channel: config.slack.chanel,
  });
  if (!answer) return;
  await slack.client.chat.postMessage({
    text: "",
    blocks: answer,
    thread_ts: sent.ts,
    channel: config.slack.chanel,
  });
};
