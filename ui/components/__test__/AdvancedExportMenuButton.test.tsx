/* eslint-disable import/no-extraneous-dependencies */
import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { AdvancedExportMenuButton } from "@/components/AdvancedExportMenuButton";

const onExportCsv = vi.fn(async (f) => Promise.resolve());
const onExportExcel = vi.fn(async (f) => Promise.resolve());

describe("ui > components > AdvancedExportMenuButton", () => {
  beforeAll(() => {
    render(<AdvancedExportMenuButton onExportCsv={onExportCsv} onExportExcel={onExportExcel} />);
  });

  it("Doit afficher le bouton exporter", async () => {
    const exporterButton = screen.queryByRole("button", { name: "Exporter" });

    expect(exporterButton).not.toBeNull();
  });

  it("Doit afficher la modal après un click sur le bouton exporter", async () => {
    const exporterButton = screen.queryByRole("button", { name: "Exporter" })!;
    await userEvent.click(exporterButton);

    // await chakra transition
    await new Promise((r) => setTimeout(r, 200));

    const menu = screen.queryByRole("menu");
    expect(menu).not.toBeNull();
  });
});
