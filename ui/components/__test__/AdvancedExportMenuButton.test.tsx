/* eslint-disable import/no-extraneous-dependencies */
import "@testing-library/jest-dom/vitest";

import { setTimeout } from "node:timers/promises";

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { AdvancedExportMenuButton } from "@/components/AdvancedExportMenuButton";

const onExportCsv = vi.fn(async (f) => Promise.resolve());
const onExportExcel = vi.fn(async (f) => Promise.resolve());

describe("ui > components > AdvancedExportMenuButton", () => {
  it("Ne doit pas afficher le bouton exporter si aucune fonction d'export est fournie", () => {
    const { unmount, queryByRole } = render(<AdvancedExportMenuButton />);

    const exporterButton = queryByRole("button", { name: "Exporter" });

    expect(exporterButton).toBeNull();
    unmount();
  });

  it("Doit afficher le bouton exporter", () => {
    const { unmount, queryByRole } = render(
      <AdvancedExportMenuButton onExportCsv={onExportCsv} onExportExcel={onExportExcel} />
    );

    const exporterButton = queryByRole("button", { name: "Exporter" });

    expect(exporterButton).not.toBeNull();
    unmount();
  });

  it("Doit afficher le bouton exporter avec uniquement un export excel", () => {
    const { unmount, queryByRole } = render(<AdvancedExportMenuButton onExportExcel={onExportExcel} />);

    const exporterButtonExcel = queryByRole("button", { name: "Exporter" });

    expect(exporterButtonExcel).not.toBeNull();
    unmount();
  });

  it("Doit afficher le bouton exporter avec uniquement un export csv", () => {
    const { unmount, queryByRole } = render(<AdvancedExportMenuButton onExportCsv={onExportCsv} />);

    const exporterButtonCsv = queryByRole("button", { name: "Exporter" });

    expect(exporterButtonCsv).not.toBeNull();
    unmount();
  });

  it("Doit afficher la modal après un click sur le bouton exporter", async () => {
    const { unmount, queryByRole } = render(
      <AdvancedExportMenuButton onExportCsv={onExportCsv} onExportExcel={onExportExcel} />
    );

    const exporterButton = queryByRole("button", { name: "Exporter" })!;
    await userEvent.click(exporterButton);

    // await chakra transition
    await setTimeout(200);

    const menu = queryByRole("menu");
    expect(menu).not.toBeNull();
    unmount();
  });
});
