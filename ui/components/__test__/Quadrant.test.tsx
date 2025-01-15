/* eslint-disable import/no-extraneous-dependencies */
import "@testing-library/jest-dom/vitest";

import { generateMock } from "@anatine/zod-mock";
import { render, screen } from "@testing-library/react";
import { ROUTES } from "shared/routes/routes";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { Quadrant } from "@/components/Quadrant";

// from ui/app/(wrapped)/intentions/pilotage/main/quadrant/QuadrantSection.tsx
const EFFECTIF_SIZES = [
  { max: 15, size: 6 },
  { min: 15, max: 40, size: 10 },
  { min: 40, max: 80, size: 14 },
  { min: 80, max: 150, size: 18 },
  { min: 150, size: 22 },
];

const { stats, formations } = generateMock(ROUTES["[GET]/pilotage-intentions/formations"].schema.response[200]);

const setCurrentFormationId = vi.fn(({ cfd, dispositif }) => {});

describe("ui > components > Quadrant", () => {
  beforeAll(() => {
    render(
      <Quadrant
        onClick={({ cfd, codeDispositif }) => setCurrentFormationId(`${cfd}_${codeDispositif}`)}
        meanInsertion={stats?.tauxInsertion}
        meanPoursuite={stats?.tauxPoursuite}
        currentFormationId={formations[0].cfd}
        data={formations?.map((formation) => ({
          ...formation,
          codeDispositif: formation.codeDispositif ?? "",
          effectif: formation.placesTransformees,
          tauxInsertion: formation.tauxInsertion ?? 0,
          tauxPoursuite: formation.tauxPoursuite ?? 0,
          libelleFormation: formation.libelleFormation ?? "",
          libelleDispositif: formation.libelleDispositif ?? "",
        }))}
        effectifSizes={EFFECTIF_SIZES}
      />
    );
  });

  it("Doit afficher le quadrant", async () => {
    const quadrant = screen.queryByRole("figure");

    expect(quadrant).not.toBe(null);
    expect(quadrant).toHaveAccessibleName();
  });
});
