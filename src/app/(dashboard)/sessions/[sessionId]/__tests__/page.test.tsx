import React, { Suspense } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SessionDetailPage from "../page";

async function renderPage(sessionId = "s1") {
  await act(async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <SessionDetailPage params={Promise.resolve({ sessionId })} />
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
  Breadcrumb: ({ items }: { items: any[] }) => (
    <nav data-testid="breadcrumb">{items.length} items</nav>
  ),
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

vi.mock("@/components/features/sessions/builder/session-builder-header", () => ({
  SessionBuilderHeader: () => <div data-testid="session-builder-header" />,
}));

vi.mock("@/components/features/sessions/builder/session-info-card", () => ({
  SessionInfoCard: ({
    form,
    header,
  }: {
    form: any;
    header: React.ReactNode;
  }) => (
    <div data-testid="session-info-card">
      {header}
      <span data-testid="form-name">{form.name}</span>
    </div>
  ),
}));

vi.mock("@/components/features/sessions/builder/screens-toolbar", () => ({
  ScreensToolbar: ({
    onAddScreen,
  }: {
    onAddScreen: () => void;
  }) => (
    <div data-testid="screens-toolbar">
      <button data-testid="add-screen-btn" onClick={onAddScreen}>
        Add Screen
      </button>
    </div>
  ),
}));

vi.mock("@/components/features/sessions/builder/sortable-screen-card", () => ({
  SortableScreenCard: ({ screenNumber }: { screenNumber: number }) => (
    <div data-testid="screen-card">Screen {screenNumber}</div>
  ),
}));

vi.mock("@/components/features/sessions/builder/save-template-dialog", () => ({
  SaveTemplateDialog: () => <div data-testid="save-template-dialog" />,
}));

vi.mock("@/components/features/sessions/builder/load-template-dialog", () => ({
  LoadTemplateDialog: () => <div data-testid="load-template-dialog" />,
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;
global.confirm = vi.fn(() => true);

describe("SessionDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          _id: "s1",
          name: "Test Session",
          type: "reading",
          cefrLevel: "A1",
          isActive: true,
          sessionGroupId: "g1",
          screens: [
            {
              actions: [
                { type: "explain", text: [] },
              ],
            },
          ],
        }),
    });
  });

  it("renders page after data loads", async () => {
    await renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("page-header")).toHaveTextContent("Session");
    });

    expect(screen.getByTestId("session-info-card")).toBeInTheDocument();
    expect(screen.getByTestId("screens-toolbar")).toBeInTheDocument();
    expect(screen.getByTestId("sticky-footer")).toBeInTheDocument();
  });

  it("fetches session data on mount", async () => {
    await renderPage();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/sessions/s1?include=breadcrumbs",
      );
    });
  });

  it("displays session form data", async () => {
    await renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("form-name")).toHaveTextContent(
        "Test Session",
      );
    });
  });

  it("renders screen cards from fetched data", async () => {
    await renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("screen-card")).toBeInTheDocument();
    });
  });

  it("calls save API when save button clicked", async () => {
    const user = userEvent.setup();
    await renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("save-btn")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("save-btn"));

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/sessions/s1",
      expect.objectContaining({ method: "PUT" }),
    );
  });

  it("calls delete API when delete button clicked", async () => {
    const user = userEvent.setup();
    await renderPage();

    await waitFor(() => {
      expect(screen.getByTestId("delete-btn")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("delete-btn"));

    expect(mockFetch).toHaveBeenCalledWith("/api/sessions/s1", {
      method: "DELETE",
    });
  });

  it("renders builder header", async () => {
    await renderPage();

    await waitFor(() => {
      expect(
        screen.getByTestId("session-builder-header"),
      ).toBeInTheDocument();
    });
  });
});
