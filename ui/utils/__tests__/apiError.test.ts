import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { AxiosError } from "axios";
import { beforeEach, describe, expect, it } from "vitest";

import type { ApiError, DetailedApiError } from "@/utils/apiError";
import { getDetailedErrorMessage, getErrorMessage } from "@/utils/apiError";

describe("getErrorMessage", () => {
  let fixture: ReturnType<typeof fixtureBuilder>;

  beforeEach(() => {
    fixture = fixtureBuilder();
  });

  describe("Null", () => {
    it("devrait retourner null si aucune erreur n'est fournie", () => {
      fixture.given.nullError();

      fixture.when.getErrorMessage();

      fixture.then.expectErrorMessage(null);
    });
  });

  describe("AxiosError", () => {
    it("devrait retourner le message de l'erreur Axios depuis la réponse", () => {
      fixture.given.axiosErrorWithResponse({
        data: {
          error: "Une erreur est survenue",
          message: "Message d'erreur spécifique",
          statusCode: 400
        },
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: {} as InternalAxiosRequestConfig<unknown>
      });

      fixture.when.getErrorMessage();

      fixture.then.expectErrorMessage("Message d'erreur spécifique");
    });

    it("devrait retourner le message par défaut si le message de réponse est absent", () => {
      fixture.given.axiosErrorWithResponse({
        data: {
          error: "Une erreur est survenue",
          statusCode: 400
        },
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: {} as InternalAxiosRequestConfig<unknown>
      });

      fixture.when.getErrorMessage("Message par défaut");

      fixture.then.expectErrorMessage("Message par défaut");
    });
  });

  describe("Error", () => {
    it("devrait retourner le message d'erreur standard pour une erreur non-Axios", () => {

      fixture.given.error(new Error("Erreur standard"));

      fixture.when.getErrorMessage("Message par défaut");

      fixture.then.expectErrorMessage("Erreur standard");
    });
  });

  const fixtureBuilder = () => {
    let error: Error | AxiosError<ApiError> | null = null;
    let result: string | null = null;

    return {
      given: {
        axiosErrorWithResponse: (response: AxiosResponse<ApiError>) => {
          const axiosError = new AxiosError();

          axiosError.response = response;

          error = axiosError;
        },
        error: (err: Error) => {
          error = err;
        },
        nullError: () => {
          error = null;
        },
      },
      when: {
        getErrorMessage: (defaultMessage?: string) => {
          result = getErrorMessage(error, defaultMessage);
        }
      },
      then: {
        expectErrorMessage: (expected: string | null) => {
          expect(result).toBe(expected);
        }
      }
    };
  };
});

describe("getDetailedErrorMessage", () => {
  let fixture: ReturnType<typeof detailedFixtureBuilder>;

  beforeEach(() => {
    fixture = detailedFixtureBuilder();
  });

  describe("Null", () => {
    it("devrait retourner null si aucune erreur n'est fournie", () => {
      fixture.given.nullError();

      fixture.when.getDetailedErrorMessage();

      fixture.then.expectDetailedErrorMessage(null);
    });
  });

  describe("AxiosError", () => {
    it("devrait retourner les erreurs détaillées depuis la réponse", () => {
      fixture.given.axiosErrorWithResponse({
        data: {
          error: "Une erreur est survenue",
          name: "ValidationError",
          data: {
            errors: {
              field1: "Erreur sur le champ 1",
              field2: "Erreur sur le champ 2"
            }
          },
          statusCode: 400
        },
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: {} as InternalAxiosRequestConfig<unknown>
      });

      fixture.when.getDetailedErrorMessage();

      fixture.then.expectDetailedErrorMessage({
        field1: "Erreur sur le champ 1",
        field2: "Erreur sur le champ 2"
      });
    });

    it("devrait retourner un objet avec le message d'erreur si pas d'erreurs détaillées", () => {
      fixture.given.axiosErrorWithResponse({
        data: {
          error: "Une erreur est survenue",
          name: "Error",
          message: "Message d'erreur spécifique",
          statusCode: 400
        },
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: {} as InternalAxiosRequestConfig<unknown>
      });

      fixture.when.getDetailedErrorMessage();

      fixture.then.expectDetailedErrorMessage({
        message: "Message d'erreur spécifique"
      });
    });

    it("devrait retourner le message par défaut si aucun message n'est fourni", () => {
      fixture.given.axiosErrorWithResponse({
        data: {
          error: "Une erreur est survenue",
          name: "Error",
          statusCode: 400
        },
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: {} as InternalAxiosRequestConfig<unknown>
      });

      fixture.when.getDetailedErrorMessage("Message par défaut");

      fixture.then.expectDetailedErrorMessage({
        message: "Message par défaut"
      });
    });
  });

  describe("Error", () => {
    it("devrait retourner un objet avec le message pour une erreur standard", () => {
      fixture.given.error(new Error("Erreur standard"));

      fixture.when.getDetailedErrorMessage();

      fixture.then.expectDetailedErrorMessage({
        message: "Erreur standard"
      });
    });

    it("devrait retourner un objet sans message d'erreur", () => {
      fixture.given.error(new Error());

      fixture.when.getDetailedErrorMessage();

      fixture.then.expectDetailedErrorMessage({
        message: ""
      });
    });
  });

  const detailedFixtureBuilder = () => {
    let error: Error | AxiosError<DetailedApiError> | null = null;
    let result: Record<string, string> | null = null;

    return {
      given: {
        axiosErrorWithResponse: (response: AxiosResponse<DetailedApiError>) => {
          const axiosError = new AxiosError();
          axiosError.response = response;
          error = axiosError;
        },
        error: (err: Error) => {
          error = err;
        },
        nullError: () => {
          error = null;
        },
      },
      when: {
        getDetailedErrorMessage: (defaultMessage?: string) => {
          result = getDetailedErrorMessage(error, defaultMessage);
        }
      },
      then: {
        expectDetailedErrorMessage: (expected: Record<string, string> | null) => {
          expect(result).toEqual(expected);
        }
      }
    };
  };
});


