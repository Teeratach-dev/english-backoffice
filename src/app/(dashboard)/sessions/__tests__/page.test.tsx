import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SessionsListPage from "../page";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/components/layouts/page-header", () => ({
  PageHeader: ({ title }: { title: string }) => (
    <h1 data-testid="page-header">{title}</h1>
  ),
}));

vi.mock("@/components/features/sessions/sessions-table", () => ({
  SessionsTable: ({
    onEdit,
    onDelete,
    addButton,
  }: {
    onEdit: (session: any) => void;
    onDelete: (session: any) => void;
    addButton: React.ReactNode;
  }) => (
    <div data-testid="sessions-table">
      {addButton}
      <button
        data-testid="edit-session-btn"
        onClick={() => onEdit({ _id: "1", name: "Test Session" })}
      >
        Edit
      </button>
      <button
        data-testid="delete-session-btn"
        onClick={() => onDelete({ _id: "1", name: "Test Session" })}
      >
        Delete
      </button>
    </div>
  ),
  SessionItem: {},
}));

vi.mock("@/components/features/sessions/session-form", () => ({
  SessionForm: ({
    initialData,
    onSuccess,
  }: {
    initialData?: any;
    onSuccess: () => void;
  }) => (
    <div data-testid="session-form">
      <span data-testid="form-mode">{initialData ? "edit" : "add"}</span>
      <button data-testid="form-submit" onClick={onSuccess}>
        Submit
      </button>
    </div>
  ),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("SessionsListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({ ok: true });
  });

  it("renders page header", () => {
    render(<SessionsListPage />);
    expect(screen.getByTestId("page-header")).toHaveTextContent(
      "Session Details",
    );
  });

  it("renders sessions table", () => {
    render(<SessionsListPage />);
    expect(screen.getByTestId("sessions-table")).toBeInTheDocument();
  });

  it("opens add dialog when add button is clicked", async () => {
    const user = userEvent.setup();
    render(<SessionsListPage />);

    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(screen.getByTestId("session-form")).toBeInTheDocument();
    expect(screen.getByTestId("form-mode")).toHaveTextContent("add");
  });

  it("opens edit dialog when edit is triggered", async () => {
    const user = userEvent.setup();
    render(<SessionsListPage />);

    await user.click(screen.getByTestId("edit-session-btn"));

    expect(screen.getByTestId("session-form")).toBeInTheDocument();
    expect(screen.getByTestId("form-mode")).toHaveTextContent("edit");
  });

  it("shows delete confirmation dialog", async () => {
    const user = userEvent.setup();
    render(<SessionsListPage />);

    await user.click(screen.getByTestId("delete-session-btn"));

    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByText(/Test Session/)).toBeInTheDocument();
  });

  it("calls delete API when confirmed", async () => {
    const user = userEvent.setup();
    render(<SessionsListPage />);

    await user.click(screen.getByTestId("delete-session-btn"));
    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(mockFetch).toHaveBeenCalledWith("/api/sessions/1", {
      method: "DELETE",
    });
  });

  it("closes dialog on form success", async () => {
    const user = userEvent.setup();
    render(<SessionsListPage />);

    await user.click(screen.getByRole("button", { name: /add/i }));
    await user.click(screen.getByTestId("form-submit"));

    expect(screen.queryByTestId("session-form")).not.toBeInTheDocument();
  });
});
