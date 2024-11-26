// @ts-expect-error TODO
const emojiRegex = /\p{Emoji}/u;

export const isEmoji = (emoji: string) => {
  return emojiRegex.test(emoji);
};
