import React, { Suspense } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UnitDetailPage from "../page";

async function renderPage(unitId = "123") {
  await act(async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <UnitDetailPage params={Promise.resolve({ unitId })} />
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

vi.mock("@/components/features/units/unit-detail-form", () => ({
  UnitDetailForm: ({ form }: { form: any }) => (
    <div data-testid="unit-detail-form">
      <span data-testid="form-name">{form.name}</span>
    </div>
  ),
}));

vi.mock("@/components/features/topics/topic-sortable-list", () => ({
  TopicSortableList: ({
    addButton,
    onEdit,
  }: {
    addButton: React.ReactNode;
    onEdit: (t: any) => void;
  }) => (
    <div data-testid="topic-sortable-list">
      {addButton}
      <button
        data-testid="edit-child-btn"
        onClick={() => onEdit({ _id: "t1", name: "Topic 1" })}
      >
        Edit
      </button>
    </div>
  ),
}));

vi.mock("@/components/features/topics/topic-form", () => ({
  TopicForm: ({ onSuccess }: { onSuccess: () => void }) => (
    <div data-testid="topic-form">
      <button data-testid="form-submit" onClick={onSuccess}>
        Submit
      </button>
    </div>
  ),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;
global.confirm = vi.fn(() => true);

describe("UnitDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          _id: "123",
          name: "Test Unit",
          description: "Test desc",
          isActive: true,
          courseId: "c1",
          children: [{ _id: "t1", name: "Topic 1" }],
        }),
    });
  });

  it("renders page after data loads", async () => {
    await renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("page-header")).toHaveTextContent("Unit");
    });

    expect(screen.getByTestId("unit-detail-form")).toBeInTheDocument();
    expect(screen.getByTestId("topic-sortable-list")).toBeInTheDocument();
    expect(screen.getByTestId("sticky-footer")).toBeInTheDocument();
  });

  it("fetches data with correct URL", async () => {
    await renderPage();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/units/123?include=children",
      );
    });
  });

  it("opens dialog when add button clicked", async () => {
    const user = userEvent.setup();
    await renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("topic-sortable-list")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /add/i }));
    expect(screen.getByTestId("topic-form")).toBeInTheDocument();
  });

  it("opens dialog when edit child clicked", async () => {
    const user = userEvent.setup();
    await renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("edit-child-btn")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("edit-child-btn"));
    expect(screen.getByTestId("topic-form")).toBeInTheDocument();
  });

  it("calls save on save button click", async () => {
    const user = userEvent.setup();
    await renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("save-btn")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("save-btn"));

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/units/123",
      expect.objectContaining({ method: "PUT" }),
    );
  });
});
