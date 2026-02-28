import React, { Suspense } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TopicDetailPage from "../page";

async function renderPage(topicId = "456") {
  await act(async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <TopicDetailPage params={Promise.resolve({ topicId })} />
      </Suspense>,
    );
  });
}

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/components/layouts/page-header", () => ({
  PageHeader: ({ title }: { title: string }) => (
    <h1 data-testid="page-header">{title}</h1>
  ),
}));

vi.mock("@/components/layouts/breadcrumb", () => ({
  Breadcrumb: () => <nav data-testid="breadcrumb" />,
}));

vi.mock("@/components/layouts/sticky-footer", () => ({
  StickyFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sticky-footer">{children}</div>
  ),
}));

vi.mock("@/components/common/delete-button", () => ({
  DeleteButton: ({ onClick }: { onClick: () => void }) => (
    <button data-testid="delete-btn" onClick={onClick}>
      Delete
    </button>
  ),
}));

vi.mock("@/components/common/save-button", () => ({
  SaveButton: ({ onClick }: { onClick: () => void }) => (
    <button data-testid="save-btn" onClick={onClick}>
      Save
    </button>
  ),
}));

vi.mock("@/components/features/topics/topic-detail-form", () => ({
  TopicDetailForm: ({ form }: { form: any }) => (
    <div data-testid="topic-detail-form">
      <span data-testid="form-name">{form.name}</span>
    </div>
  ),
}));

vi.mock(
  "@/components/features/session-groups/session-group-sortable-list",
  () => ({
    SessionGroupSortableList: ({
      addButton,
      onEdit,
    }: {
      addButton: React.ReactNode;
      onEdit: (g: any) => void;
    }) => (
      <div data-testid="group-sortable-list">
        {addButton}
        <button
          data-testid="edit-child-btn"
          onClick={() => onEdit({ _id: "g1", name: "Group 1" })}
        >
          Edit
        </button>
      </div>
    ),
  }),
);

vi.mock("@/components/features/session-groups/session-group-form", () => ({
  SessionGroupForm: ({ onSuccess }: { onSuccess: () => void }) => (
    <div data-testid="group-form">
      <button data-testid="form-submit" onClick={onSuccess}>
        Submit
      </button>
    </div>
  ),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;
global.confirm = vi.fn(() => true);

describe("TopicDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          _id: "456",
          name: "Test Topic",
          description: "Desc",
          isActive: true,
          unitId: "u1",
          courseId: "c1",
          children: [{ _id: "g1", name: "Group 1" }],
        }),
    });
  });

  it("renders page after data loads", async () => {
    await renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("page-header")).toHaveTextContent("Topic");
    });

    expect(screen.getByTestId("topic-detail-form")).toBeInTheDocument();
    expect(screen.getByTestId("group-sortable-list")).toBeInTheDocument();
  });

  it("fetches data with correct URL", async () => {
    await renderPage();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/topics/456?include=children",
      );
    });
  });

  it("opens dialog when add button clicked", async () => {
    const user = userEvent.setup();
    await renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("group-sortable-list")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /add/i }));
    expect(screen.getByTestId("group-form")).toBeInTheDocument();
  });

  it("calls save on save button click", async () => {
    const user = userEvent.setup();
    await renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("save-btn")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("save-btn"));

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/topics/456",
      expect.objectContaining({ method: "PUT" }),
    );
  });
});
