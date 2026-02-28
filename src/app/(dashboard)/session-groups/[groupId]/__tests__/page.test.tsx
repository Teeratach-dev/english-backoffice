import React, { Suspense } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SessionGroupDetailPage from "../page";

async function renderPage(groupId = "789") {
  await act(async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <SessionGroupDetailPage params={Promise.resolve({ groupId })} />
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

vi.mock(
  "@/components/features/session-groups/session-group-detail-form",
  () => ({
    SessionGroupDetailForm: ({ form }: { form: any }) => (
      <div data-testid="group-detail-form">
        <span data-testid="form-name">{form.name}</span>
      </div>
    ),
  }),
);

vi.mock("@/components/features/sessions/session-sortable-list", () => ({
  SessionSortableList: ({
    addButton,
    onEdit,
  }: {
    addButton: React.ReactNode;
    onEdit: (s: any) => void;
  }) => (
    <div data-testid="session-sortable-list">
      {addButton}
      <button
        data-testid="edit-child-btn"
        onClick={() => onEdit({ _id: "s1", name: "Session 1" })}
      >
        Edit
      </button>
    </div>
  ),
}));

vi.mock("@/components/features/sessions/session-form", () => ({
  SessionForm: ({ onSuccess }: { onSuccess: () => void }) => (
    <div data-testid="session-form">
      <button data-testid="form-submit" onClick={onSuccess}>
        Submit
      </button>
    </div>
  ),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;
global.confirm = vi.fn(() => true);

describe("SessionGroupDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          _id: "789",
          name: "Test Group",
          description: "Desc",
          isActive: true,
          topicId: "t1",
          unitId: "u1",
          courseId: "c1",
          children: [{ _id: "s1", name: "Session 1" }],
        }),
    });
  });

  it("renders page after data loads", async () => {
    await renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("page-header")).toHaveTextContent(
        "Session Group",
      );
    });

    expect(screen.getByTestId("group-detail-form")).toBeInTheDocument();
    expect(screen.getByTestId("session-sortable-list")).toBeInTheDocument();
  });

  it("fetches data with correct URL", async () => {
    await renderPage();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/session-groups/789?include=children",
      );
    });
  });

  it("opens dialog when add button clicked", async () => {
    const user = userEvent.setup();
    await renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("session-sortable-list")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /add/i }));
    expect(screen.getByTestId("session-form")).toBeInTheDocument();
  });

  it("calls save on save button click", async () => {
    const user = userEvent.setup();
    await renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("save-btn")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("save-btn"));

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/session-groups/789",
      expect.objectContaining({ method: "PUT" }),
    );
  });
});
