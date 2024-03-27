import "../../../../../../config/config";

import Boom from "@hapi/boom";

import {
  getPageAsMarkdown,
  getPageProperties,
} from "../../../../core/services/notion/notion";
import { dependencies } from "../dependencies";
import { getGlossaireEntryFactory } from "../getGlossaireEntry.usecase";

const GetGlossaireFixture = () => {
  let errorMessage: string;
  let usecase: ReturnType<typeof getGlossaireEntryFactory>;
  let response: Awaited<ReturnType<typeof usecase>>;

  return {
    givenGetPageImplementation: (
      getPageFcn: typeof getPageAsMarkdown,
      getPagePpts: typeof getPageProperties,
      mapNotionPageToGlEnt: typeof dependencies.mapNotionPageToGlossaireEntry
    ) => {
      usecase = getGlossaireEntryFactory({
        getPageAsMarkdown: getPageFcn,
        getPageProperties: getPagePpts,
        mapNotionPageToGlossaireEntry: mapNotionPageToGlEnt,
      });
    },
    whenGetGlossaireEntry: async (id: string) => {
      try {
        response = await usecase(id);
      } catch (error) {
        errorMessage = (error as Error)?.message;
      }
    },
    thenExpectedErrorMessageIs: (expectedErrorMessage: string) => {
      expect(errorMessage).toEqual(expectedErrorMessage);
    },
    thenExpectedResponseIs: (
      expectedResponse: Awaited<ReturnType<typeof usecase>>
    ) => {
      expect(response).toEqual(expectedResponse);
    },
  };
};

describe("Feature: Getting a Glossaire Entry", () => {
  it("Scenario: The entry is not existitng", async () => {
    const currentPageId = "id-page-1";
    const currentFixture = GetGlossaireFixture();

    currentFixture.givenGetPageImplementation(
      () => {
        throw Boom.badImplementation(
          "Erreur lors de la récupération des informations de la page Notion avec l'id : " +
            currentPageId
        );
      },
      jest.fn(),
      jest.fn()
    );

    await currentFixture.whenGetGlossaireEntry(currentPageId);

    currentFixture.thenExpectedErrorMessageIs(
      `Erreur lors de la récupération des informations de la page Notion avec l'id : ${currentPageId}`
    );
  });

  it("Scenario: The entry is existing", async () => {
    const currentPageId = "id-page-1";
    const currentFixure = GetGlossaireFixture();

    currentFixure.givenGetPageImplementation(
      async () => {
        return "## Test";
      },
      jest.fn(),
      () => {
        return {
          id: currentPageId,
          icon: "icon",
          title: "title",
          indicator: {
            color: "yellow",
            name: "InserJeunes",
          },
          status: "validé",
        };
      }
    );

    await currentFixure.whenGetGlossaireEntry(currentPageId);

    currentFixure.thenExpectedResponseIs({
      id: currentPageId,
      icon: "icon",
      title: "title",
      content: "## Test",
      indicator: {
        color: "yellow",
        name: "InserJeunes",
      },
      status: "validé",
    });
  });
});
