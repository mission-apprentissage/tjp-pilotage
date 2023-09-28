import { App, Block, KnownBlock } from "@slack/bolt";

import { config } from "../../../../../config/config";

const slack = new App({
  token: config.slack.token,
  signingSecret: config.slack.signingSecret,
});

export const sendToSlack = async (
  main: (Block | KnownBlock)[],
  answer?: (Block | KnownBlock)[]
) => {
  if (!config.slack.chanel) return;
  const sent = await slack.client.chat.postMessage({
    blocks: main,
    channel: config.slack.chanel,
  });
  if (!answer) return;
  await slack.client.chat.postMessage({
    blocks: answer,
    thread_ts: sent.ts,
    channel: config.slack.chanel,
  });
};
