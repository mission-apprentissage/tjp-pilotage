import assert from "assert";

import { compare, hash } from "../../src/common/utils/passwordUtils.js";

describe("passwordUtils", () => {
  const rounds = 1002;

  it("Peut hasher une chaine de caractère", () => {
    const passwordHash = hash("password", rounds);

    assert.strictEqual(passwordHash.startsWith("$6$rounds=1002"), true);
  });

  it("Peut comparer une chaîne de caractère avec un hash", () => {
    const sha512 = hash("password", rounds);

    assert.strictEqual(compare("INVALID", sha512), false);
    assert.strictEqual(compare("password", sha512), true);
  });
});
