import { describe, expect, it } from "vitest";

import { createParameterizedUrl } from "@/utils/createParameterizedUrl";

describe("ui > utils > createParameterizedUrl", () => {
  it("Doit remplacer le paramètre de requête dans l'URL avec la valeur fournie", () => {
    const url = "/api/user";
    const params = { id: "123" };
    const result = createParameterizedUrl(url, params);
    expect(result).toBe("/api/user?id=123");
  });

  it("Doit remplacer les paramètres de requête dans l'URL avec les valeurs fournies", () => {
    const url = "/api/user";
    const params = { id: "123", name: "Marin" };
    const result = createParameterizedUrl(url, params);
    expect(result).toBe("/api/user?id=123&name=Marin");
  });

  it("Doit remplacer les paramètres de requête en gardant la profondeur d'objet", () => {
    const url = "/api/user";
    const params = { id: "123", user: { firstname: "Marin", lastname: "Orion" } };
    const result = createParameterizedUrl(url, params);
    expect(result).toBe("/api/user?id=123&user[firstname]=Marin&user[lastname]=Orion");
  });
});
