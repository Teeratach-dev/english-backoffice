import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UnitsListPage from "../page";

vi.mock("@/components/layouts/page-header", () => ({
  PageHeader: ({ title }: { title: string }) => (
    <h1 data-testid="page-header">{title}</h1>
  ),
}));

vi.mock("@/components/features/units/unit-table", () => ({
  UnitTable: ({
    onEdit,
    addButton,
  }: {
    onEdit: (unit: any) => void;
    addButton: React.ReactNode;
  }) => (
    <div data-testid="unit-table">
      {addButton}
      <button
        data-testid="edit-unit-btn"
        onClick={() => onEdit({ _id: "1", name: "Test Unit" })}
      >
        Edit
      </button>
    </div>
  ),
  UnitItem: {},
}));

vi.mock("@/components/features/units/unit-form", () => ({
  UnitForm: ({
    initialData,
    onSuccess,
  }: {
    initialData?: any;
    onSuccess: () => void;
  }) => (
    <div data-testid="unit-form">
      <span data-testid="form-mode">{initialData ? "edit" : "add"}</span>
      <button data-testid="form-submit" onClick={onSuccess}>
        Submit
      </button>
    </div>
  ),
}));

describe("UnitsListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page header with correct title", () => {
    render(<UnitsListPage />);
    expect(screen.getByTestId("page-header")).toHaveTextContent("Units");
  });

  it("renders unit table", () => {
    render(<UnitsListPage />);
    expect(screen.getByTestId("unit-table")).toBeInTheDocument();
  });

  it("opens add dialog when add button is clicked", async () => {
    const user = userEvent.setup();
    render(<UnitsListPage />);

    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(screen.getByTestId("unit-form")).toBeInTheDocument();
    expect(screen.getByTestId("form-mode")).toHaveTextContent("add");
  });

  it("opens edit dialog when edit is triggered", async () => {
    const user = userEvent.setup();
    render(<UnitsListPage />);

    await user.click(screen.getByTestId("edit-unit-btn"));

    expect(screen.getByTestId("unit-form")).toBeInTheDocument();
    expect(screen.getByTestId("form-mode")).toHaveTextContent("edit");
  });

  it("closes dialog on form success", async () => {
    const user = userEvent.setup();
    render(<UnitsListPage />);

    await user.click(screen.getByRole("button", { name: /add/i }));
    await user.click(screen.getByTestId("form-submit"));

    expect(screen.queryByTestId("unit-form")).not.toBeInTheDocument();
  });
});
