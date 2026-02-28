import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SessionGroupsListPage from "../page";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/components/layouts/page-header", () => ({
  PageHeader: ({ title }: { title: string }) => (
    <h1 data-testid="page-header">{title}</h1>
  ),
}));

vi.mock("@/components/features/session-groups/session-group-table", () => ({
  SessionGroupTable: ({
    onEdit,
    onDelete,
    addButton,
  }: {
    onEdit: (group: any) => void;
    onDelete: (group: any) => void;
    addButton: React.ReactNode;
  }) => (
    <div data-testid="session-group-table">
      {addButton}
      <button
        data-testid="edit-group-btn"
        onClick={() => onEdit({ _id: "1", name: "Test Group" })}
      >
        Edit
      </button>
      <button
        data-testid="delete-group-btn"
        onClick={() => onDelete({ _id: "1", name: "Test Group" })}
      >
        Delete
      </button>
    </div>
  ),
  SessionGroupItem: {},
}));

vi.mock("@/components/features/session-groups/session-group-form", () => ({
  SessionGroupForm: ({
    initialData,
    onSuccess,
  }: {
    initialData?: any;
    onSuccess: () => void;
  }) => (
    <div data-testid="session-group-form">
      <span data-testid="form-mode">{initialData ? "edit" : "add"}</span>
      <button data-testid="form-submit" onClick={onSuccess}>
        Submit
      </button>
    </div>
  ),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("SessionGroupsListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({ ok: true });
  });

  it("renders page header", () => {
    render(<SessionGroupsListPage />);
    expect(screen.getByTestId("page-header")).toHaveTextContent(
      "Session Groups",
    );
  });

  it("renders session group table", () => {
    render(<SessionGroupsListPage />);
    expect(screen.getByTestId("session-group-table")).toBeInTheDocument();
  });

  it("opens add dialog when add button is clicked", async () => {
    const user = userEvent.setup();
    render(<SessionGroupsListPage />);

    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(screen.getByTestId("session-group-form")).toBeInTheDocument();
    expect(screen.getByTestId("form-mode")).toHaveTextContent("add");
  });

  it("opens edit dialog when edit is triggered", async () => {
    const user = userEvent.setup();
    render(<SessionGroupsListPage />);

    await user.click(screen.getByTestId("edit-group-btn"));

    expect(screen.getByTestId("session-group-form")).toBeInTheDocument();
    expect(screen.getByTestId("form-mode")).toHaveTextContent("edit");
  });

  it("shows delete confirmation dialog", async () => {
    const user = userEvent.setup();
    render(<SessionGroupsListPage />);

    await user.click(screen.getByTestId("delete-group-btn"));

    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByText(/Test Group/)).toBeInTheDocument();
  });

  it("calls delete API when confirmed", async () => {
    const user = userEvent.setup();
    render(<SessionGroupsListPage />);

    await user.click(screen.getByTestId("delete-group-btn"));
    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(mockFetch).toHaveBeenCalledWith("/api/session-groups/1", {
      method: "DELETE",
    });
  });

  it("closes dialog on form success", async () => {
    const user = userEvent.setup();
    render(<SessionGroupsListPage />);

    await user.click(screen.getByRole("button", { name: /add/i }));
    await user.click(screen.getByTestId("form-submit"));

    expect(screen.queryByTestId("session-group-form")).not.toBeInTheDocument();
  });
});
