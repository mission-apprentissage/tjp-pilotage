import { describe, expect, test } from "vitest";

import { passwordRegex } from "../passwordRegex";

describe("Tests de la regex de mot de passe", () => {
  test("Valide un mot de passe correct", () => {
    expect("P@ssw0rd").toMatch(new RegExp(passwordRegex));
    expect("M0tdep@ssé").toMatch(new RegExp(passwordRegex));
  });

  test("Invalide un mot de passe trop court (5 caractères)", () => {
    expect("P@ss1").not.toMatch(new RegExp(passwordRegex));
  });

  test("Invalide un mot de passe sans chiffre", () => {
    expect("Password!").not.toMatch(new RegExp(passwordRegex));
  });

  test("Invalide un mot de passe sans lettre majuscule", () => {
    expect("p@ssw0rd").not.toMatch(new RegExp(passwordRegex));
  });

  test("Invalide un mot de passe sans caractère spécial", () => {
    expect("Password1").not.toMatch(new RegExp(passwordRegex));
  });

  test("Invalide un mot de passe avec espace", () => {
    expect("P@ss word1").not.toMatch(new RegExp(passwordRegex));
  });

  test("Invalide un mot de passe sans minuscule", () => {
    expect("P@SSWORD1").not.toMatch(new RegExp(passwordRegex));
  });

  test("Valide un mot de passe avec des caractères accentués", () => {
    expect("M0tdep@ssé").toMatch(new RegExp(passwordRegex));
    expect("P@ssw0rdé").toMatch(new RegExp(passwordRegex));
  });

  test("Invalide un mot de passe trop long (24 caractères)", () => {
    expect("P@ssw0rdP@ssw0rdP@ssw0rd").not.toMatch(new RegExp(passwordRegex));
  });
});
