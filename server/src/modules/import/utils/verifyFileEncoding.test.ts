import path from "path";

import { verifyFileEncoding } from "./verifyFileEncoding";

const UTF8_FILE_PATH = "./__test__/utf8.csv";
const UTF8_BOM_FILE_PATH = "./__test__/utf8_BOM.csv";
const NOT_UTF8_FILE_PATH = "./__test__/windows_1252.csv";

describe("verifyFileEncoding", () => {
  it("should detect UTF-8", async () => {
    const res = await verifyFileEncoding(path.join(__dirname, UTF8_FILE_PATH));
    expect(res).toBe(true);
  });
  it("should detect UTF-8 BOM", async () => {
    const res = await verifyFileEncoding(path.join(__dirname, UTF8_BOM_FILE_PATH));
    expect(res).toBe(true);
  });
  it("should throw if not utf8", async () => {
    try {
      await verifyFileEncoding(path.join(__dirname, NOT_UTF8_FILE_PATH));
    } catch (err) {
      expect(err).toMatch("err");
    }
  });
});
