import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TopicsListPage from "../page";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/components/layouts/page-header", () => ({
  PageHeader: ({ title }: { title: string }) => (
    <h1 data-testid="page-header">{title}</h1>
  ),
}));

vi.mock("@/components/features/topics/topic-table", () => ({
  TopicTable: ({
    onEdit,
    onDelete,
    addButton,
  }: {
    onEdit: (topic: any) => void;
    onDelete: (topic: any) => void;
    addButton: React.ReactNode;
  }) => (
    <div data-testid="topic-table">
      {addButton}
      <button
        data-testid="edit-topic-btn"
        onClick={() => onEdit({ _id: "1", name: "Test Topic" })}
      >
        Edit
      </button>
      <button
        data-testid="delete-topic-btn"
        onClick={() => onDelete({ _id: "1", name: "Test Topic" })}
      >
        Delete
      </button>
    </div>
  ),
  TopicItem: {},
}));

vi.mock("@/components/features/topics/topic-form", () => ({
  TopicForm: ({
    initialData,
    onSuccess,
  }: {
    initialData?: any;
    onSuccess: () => void;
  }) => (
    <div data-testid="topic-form">
      <span data-testid="form-mode">{initialData ? "edit" : "add"}</span>
      <button data-testid="form-submit" onClick={onSuccess}>
        Submit
      </button>
    </div>
  ),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("TopicsListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({ ok: true });
  });

  it("renders page header with correct title", () => {
    render(<TopicsListPage />);
    expect(screen.getByTestId("page-header")).toHaveTextContent("Topics");
  });

  it("renders topic table", () => {
    render(<TopicsListPage />);
    expect(screen.getByTestId("topic-table")).toBeInTheDocument();
  });

  it("opens add dialog when add button is clicked", async () => {
    const user = userEvent.setup();
    render(<TopicsListPage />);

    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(screen.getByTestId("topic-form")).toBeInTheDocument();
    expect(screen.getByTestId("form-mode")).toHaveTextContent("add");
  });

  it("opens edit dialog when edit is triggered", async () => {
    const user = userEvent.setup();
    render(<TopicsListPage />);

    await user.click(screen.getByTestId("edit-topic-btn"));

    expect(screen.getByTestId("topic-form")).toBeInTheDocument();
    expect(screen.getByTestId("form-mode")).toHaveTextContent("edit");
  });

  it("shows delete confirmation dialog", async () => {
    const user = userEvent.setup();
    render(<TopicsListPage />);

    await user.click(screen.getByTestId("delete-topic-btn"));

    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByText(/Test Topic/)).toBeInTheDocument();
  });

  it("calls delete API when confirmed", async () => {
    const user = userEvent.setup();
    render(<TopicsListPage />);

    await user.click(screen.getByTestId("delete-topic-btn"));
    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(mockFetch).toHaveBeenCalledWith("/api/topics/1", {
      method: "DELETE",
    });
  });

  it("closes dialog and refreshes on form success", async () => {
    const user = userEvent.setup();
    render(<TopicsListPage />);

    await user.click(screen.getByRole("button", { name: /add/i }));
    await user.click(screen.getByTestId("form-submit"));

    expect(screen.queryByTestId("topic-form")).not.toBeInTheDocument();
  });
});
