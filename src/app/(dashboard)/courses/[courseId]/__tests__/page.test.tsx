import React, { Suspense } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CourseDetailPage from "../page";

async function renderPage(courseId = "c1") {
  await act(async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <CourseDetailPage params={Promise.resolve({ courseId })} />
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

vi.mock("@/components/features/courses/course-detail-form", () => ({
  CourseDetailForm: ({ form }: { form: any }) => (
    <div data-testid="course-detail-form">
      <span data-testid="form-name">{form.name}</span>
    </div>
  ),
}));

vi.mock("@/components/features/units/unit-sortable-list", () => ({
  UnitSortableList: ({
    addButton,
    onEdit,
  }: {
    addButton: React.ReactNode;
    onEdit: (u: any) => void;
  }) => (
    <div data-testid="unit-sortable-list">
      {addButton}
      <button
        data-testid="edit-child-btn"
        onClick={() => onEdit({ _id: "u1", name: "Unit 1" })}
      >
        Edit
      </button>
    </div>
  ),
}));

vi.mock("@/components/features/units/unit-form", () => ({
  UnitForm: ({ onSuccess }: { onSuccess: () => void }) => (
    <div data-testid="unit-form">
      <button data-testid="form-submit" onClick={onSuccess}>
        Submit
      </button>
    </div>
  ),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;
global.confirm = vi.fn(() => true);

describe("CourseDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          _id: "c1",
          name: "Test Course",
          description: "Desc",
          price: 100,
          isActive: true,
          purchaseable: true,
          children: [{ _id: "u1", name: "Unit 1" }],
        }),
    });
  });

  it("renders page after data loads", async () => {
    await renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("page-header")).toHaveTextContent("Course");
    });

    expect(screen.getByTestId("course-detail-form")).toBeInTheDocument();
    expect(screen.getByTestId("unit-sortable-list")).toBeInTheDocument();
  });

  it("fetches data with correct URL", async () => {
    await renderPage();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/courses/c1?include=children",
      );
    });
  });

  it("opens dialog when add button clicked", async () => {
    const user = userEvent.setup();
    await renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("unit-sortable-list")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /add/i }));
    expect(screen.getByTestId("unit-form")).toBeInTheDocument();
  });

  it("calls save on save button click", async () => {
    const user = userEvent.setup();
    await renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("save-btn")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("save-btn"));

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/courses/c1",
      expect.objectContaining({ method: "PUT" }),
    );
  });

  it("displays form data correctly", async () => {
    await renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("form-name")).toHaveTextContent("Test Course");
    });
  });
});
