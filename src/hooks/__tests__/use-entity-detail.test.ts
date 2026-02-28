import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useEntityDetail } from "../use-entity-detail";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;
global.confirm = vi.fn(() => true);

const defaultConfig = {
  apiPath: "/api/units",
  entityId: "123",
  formDefaults: { name: "", description: "", isActive: true },
  redirectPath: "/courses/1",
  entityLabel: "Unit",
};

describe("useEntityDetail", () => {
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
          children: [{ _id: "child1" }],
        }),
    });
  });

  it("fetches data on mount", async () => {
    const { result } = renderHook(() => useEntityDetail(defaultConfig));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/units/123?include=children");
    expect(result.current.entity).toEqual(
      expect.objectContaining({ name: "Test Unit" }),
    );
    expect(result.current.children).toHaveLength(1);
  });

  it("uses mapData when provided", async () => {
    const { result } = renderHook(() =>
      useEntityDetail({
        ...defaultConfig,
        mapData: (data) => ({
          form: {
            name: data.name,
            description: data.description,
            isActive: data.isActive,
          },
          children: data.children,
          raw: data,
        }),
      }),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.form).toEqual({
      name: "Test Unit",
      description: "Test desc",
      isActive: true,
    });
  });

  it("saves entity and redirects", async () => {
    const { result } = renderHook(() => useEntityDetail(defaultConfig));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.save();
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/units/123",
      expect.objectContaining({ method: "PUT" }),
    );
    expect(mockPush).toHaveBeenCalledWith("/courses/1");
  });

  it("deletes entity and redirects", async () => {
    const { result } = renderHook(() => useEntityDetail(defaultConfig));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.remove();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/units/123", {
      method: "DELETE",
    });
    expect(mockPush).toHaveBeenCalledWith("/courses/1");
  });

  it("does not delete when confirm is cancelled", async () => {
    (global.confirm as any).mockReturnValueOnce(false);
    const { result } = renderHook(() => useEntityDetail(defaultConfig));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    mockFetch.mockClear();

    await act(async () => {
      await result.current.remove();
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("handles fetch error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    const { toast } = await import("sonner");

    const { result } = renderHook(() => useEntityDetail(defaultConfig));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(toast.error).toHaveBeenCalledWith("Error loading data");
  });

  it("allows form updates", async () => {
    const { result } = renderHook(() => useEntityDetail(defaultConfig));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setForm({
        name: "Updated",
        description: "New desc",
        isActive: false,
      });
    });

    expect(result.current.form).toEqual({
      name: "Updated",
      description: "New desc",
      isActive: false,
    });
  });
});
