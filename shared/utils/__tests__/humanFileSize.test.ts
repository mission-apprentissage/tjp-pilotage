import { describe, expect, it } from "vitest";

import { humanFileSize } from "../humanFileSize";

describe("Utils: human readable file size", () => {
  it.each`
    size                       | text
    ${0}                       | ${"0 B"}
    ${12}                      | ${"12 B"}
    ${12 * 1024}               | ${"12.3 KB"}
    ${12 * 1024 * 1024}        | ${"12.6 MB"}
    ${12 * 1024 * 1024 * 1024} | ${"12.9 GB"}
  `(`Convert the byte size $size into a human readable size $text`, ({ size, text }) => {
    expect(humanFileSize(size)).toBe(text);
  });
});
