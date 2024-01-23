import Boom from "@hapi/boom";
import "../../../../../../config/config";
import { getPageAsMarkdown } from "../../../services/notion/notion";
import { getGlossaireEntryFactory } from "../getGlossaireEntry.usecase";

const GetGlossaireFixture = () => {
  let errorMessage: string;
  let response: string;
  let usecase: ReturnType<typeof getGlossaireEntryFactory>;

  return {
    givenGetPageImplementation: (getPageFcn: typeof getPageAsMarkdown) => {
      usecase = getGlossaireEntryFactory({ getPageAsMarkdown: getPageFcn });
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
    thenExpectedResponseIs: (expectedResponse: any) => {
      expect(response).toEqual(expectedResponse);
    },
  };
};

describe("Feature: Getting a Glossaire Entry", () => {
  it("Scenario: The entry is not existitng", async () => {
    const currentPageId = "id-page-1";
    const currentFixture = GetGlossaireFixture();

    currentFixture.givenGetPageImplementation(() => {
      throw Boom.badImplementation(
        "Erreur lors de la récupération des informations de la page Notion avec l'id : " +
          currentPageId
      );
    });

    await currentFixture.whenGetGlossaireEntry(currentPageId);

    currentFixture.thenExpectedErrorMessageIs(
      `Erreur lors de la récupération des informations de la page Notion avec l'id : ${currentPageId}`
    );
  });

  it("Scenario: The entry is existing", async () => {
    const currentPageId = "id-page-1";
    const currentFixure = GetGlossaireFixture();

    currentFixure.givenGetPageImplementation(async () => {
      return "## Test";
    });

    await currentFixure.whenGetGlossaireEntry(currentPageId);

    currentFixure.thenExpectedResponseIs("## Test");
  });
});
