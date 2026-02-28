import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UsersPage from "../page";

vi.mock("react-redux", () => ({
  useSelector: () => ({ role: "admin" }),
}));

vi.mock("@/store", () => ({
  RootState: {},
}));

vi.mock("@/components/layouts/page-header", () => ({
  PageHeader: ({ title }: { title: string }) => (
    <h1 data-testid="page-header">{title}</h1>
  ),
}));

vi.mock("@/components/features/users/user-table", () => ({
  UserTable: ({
    onEdit,
    addButton,
  }: {
    onEdit: (user: any) => void;
    addButton: React.ReactNode;
  }) => (
    <div data-testid="user-table">
      {addButton}
      <button
        data-testid="edit-user-btn"
        onClick={() => onEdit({ _id: "1", name: "Test User" })}
      >
        Edit
      </button>
    </div>
  ),
}));

vi.mock("@/components/features/users/user-form", () => ({
  UserForm: ({
    initialData,
    onSuccess,
  }: {
    initialData: any;
    onSuccess: () => void;
  }) => (
    <div data-testid="user-form">
      <span data-testid="form-mode">{initialData ? "edit" : "add"}</span>
      <button data-testid="form-submit" onClick={onSuccess}>
        Submit
      </button>
    </div>
  ),
}));

describe("UsersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page header with correct title", () => {
    render(<UsersPage />);
    expect(screen.getByTestId("page-header")).toHaveTextContent("Users");
  });

  it("renders user table", () => {
    render(<UsersPage />);
    expect(screen.getByTestId("user-table")).toBeInTheDocument();
  });

  it("opens add dialog when add button is clicked", async () => {
    const user = userEvent.setup();
    render(<UsersPage />);

    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(screen.getByTestId("user-form")).toBeInTheDocument();
    expect(screen.getByTestId("form-mode")).toHaveTextContent("add");
  });

  it("opens edit dialog when edit is triggered", async () => {
    const user = userEvent.setup();
    render(<UsersPage />);

    await user.click(screen.getByTestId("edit-user-btn"));

    expect(screen.getByTestId("user-form")).toBeInTheDocument();
    expect(screen.getByTestId("form-mode")).toHaveTextContent("edit");
  });

  it("closes dialog on form success", async () => {
    const user = userEvent.setup();
    render(<UsersPage />);

    await user.click(screen.getByRole("button", { name: /add/i }));
    await user.click(screen.getByTestId("form-submit"));

    expect(screen.queryByTestId("user-form")).not.toBeInTheDocument();
  });
});
