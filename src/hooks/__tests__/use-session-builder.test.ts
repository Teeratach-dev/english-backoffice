import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSessionBuilder } from "../use-session-builder";

vi.mock("@dnd-kit/sortable", () => ({
  arrayMove: (arr: any[], from: number, to: number) => {
    const result = [...arr];
    const [removed] = result.splice(from, 1);
    result.splice(to, 0, removed);
    return result;
  },
}));

vi.mock("@/types/action.types", () => ({
  ActionType: { Explain: "explain", Reading: "reading" },
  getDefaultContent: (type: string) => ({ type, text: [] }),
}));

describe("useSessionBuilder", () => {
  it("starts with empty screens", () => {
    const { result } = renderHook(() => useSessionBuilder());
    expect(result.current.screens).toHaveLength(0);
  });

  it("adds a screen", () => {
    const { result } = renderHook(() => useSessionBuilder());

    act(() => {
      result.current.addScreen();
    });

    expect(result.current.screens).toHaveLength(1);
    expect(result.current.screens[0].actions).toHaveLength(0);
  });

  it("deletes a screen", () => {
    const { result } = renderHook(() => useSessionBuilder());

    act(() => {
      result.current.addScreen();
    });

    const screenId = result.current.screens[0].id;

    act(() => {
      result.current.deleteScreen(screenId);
    });

    expect(result.current.screens).toHaveLength(0);
  });

  it("moves screen up", () => {
    const { result } = renderHook(() => useSessionBuilder());

    act(() => {
      result.current.addScreen();
      result.current.addScreen();
    });

    const secondId = result.current.screens[1].id;

    act(() => {
      result.current.moveScreen(1, "up");
    });

    expect(result.current.screens[0].id).toBe(secondId);
  });

  it("moves screen down", () => {
    const { result } = renderHook(() => useSessionBuilder());

    act(() => {
      result.current.addScreen();
      result.current.addScreen();
    });

    const firstId = result.current.screens[0].id;

    act(() => {
      result.current.moveScreen(0, "down");
    });

    expect(result.current.screens[1].id).toBe(firstId);
  });

  it("toggles screen collapse", () => {
    const { result } = renderHook(() => useSessionBuilder());

    act(() => {
      result.current.addScreen();
    });

    const screenId = result.current.screens[0].id;
    expect(result.current.screens[0].isCollapsed).toBe(false);

    act(() => {
      result.current.toggleScreenCollapse(screenId);
    });

    expect(result.current.screens[0].isCollapsed).toBe(true);
  });

  it("toggles all screens", () => {
    const { result } = renderHook(() => useSessionBuilder());

    act(() => {
      result.current.addScreen();
      result.current.addScreen();
    });

    act(() => {
      result.current.toggleAllScreens(true);
    });

    expect(result.current.screens.every((s) => s.isCollapsed)).toBe(true);

    act(() => {
      result.current.toggleAllScreens(false);
    });

    expect(result.current.screens.every((s) => !s.isCollapsed)).toBe(true);
  });

  it("adds action to screen", () => {
    const { result } = renderHook(() => useSessionBuilder());

    act(() => {
      result.current.addScreen();
    });

    const screenId = result.current.screens[0].id;

    act(() => {
      result.current.addActionToScreen(screenId, "explain" as any);
    });

    expect(result.current.screens[0].actions).toHaveLength(1);
    expect(result.current.screens[0].actions[0].type).toBe("explain");
  });

  it("deletes action from screen", () => {
    const { result } = renderHook(() => useSessionBuilder());

    act(() => {
      result.current.addScreen();
    });

    const screenId = result.current.screens[0].id;

    act(() => {
      result.current.addActionToScreen(screenId, "explain" as any);
    });

    const actionId = result.current.screens[0].actions[0].id;

    act(() => {
      result.current.deleteAction(screenId, actionId);
    });

    expect(result.current.screens[0].actions).toHaveLength(0);
  });

  it("updates action content", () => {
    const { result } = renderHook(() => useSessionBuilder());

    act(() => {
      result.current.addScreen();
    });

    const screenId = result.current.screens[0].id;

    act(() => {
      result.current.addActionToScreen(screenId, "explain" as any);
    });

    const actionId = result.current.screens[0].actions[0].id;

    act(() => {
      result.current.updateActionContent(actionId, {
        text: ["Hello"],
      });
    });

    expect(
      (result.current.screens[0].actions[0] as any).text,
    ).toEqual(["Hello"]);
  });

  it("initializes screens from data", () => {
    const { result } = renderHook(() => useSessionBuilder());

    act(() => {
      result.current.initScreens([
        {
          actions: [
            { type: "explain", text: [] },
            { type: "reading", text: [] },
          ],
        },
      ]);
    });

    expect(result.current.screens).toHaveLength(1);
    expect(result.current.screens[0].actions).toHaveLength(2);
  });

  it("generates screens payload for save", () => {
    const { result } = renderHook(() => useSessionBuilder());

    act(() => {
      result.current.addScreen();
    });

    const screenId = result.current.screens[0].id;

    act(() => {
      result.current.addActionToScreen(screenId, "explain" as any);
    });

    const payload = result.current.getScreensPayload();
    expect(payload).toHaveLength(1);
    expect(payload[0].sequence).toBe(0);
    expect(payload[0].actions).toHaveLength(1);
    expect(payload[0].actions[0]).not.toHaveProperty("id");
  });
});
