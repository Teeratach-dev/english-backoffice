"use client";

import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import {
  ActionType,
  Action,
  Screen,
  getDefaultContent,
} from "@/types/action.types";

type ScreenWithMeta = Screen & { localId?: number; isCollapsed?: boolean };

export function useSessionBuilder(initialScreens: ScreenWithMeta[] = []) {
  const [screens, setScreens] = useState<ScreenWithMeta[]>(initialScreens);
  const [nextScreenId, setNextScreenId] = useState(
    initialScreens.length + 1,
  );
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  function initScreens(data: any[]) {
    const mapped = (data || []).map((s: any, sIdx: number) => ({
      id: `scr-${sIdx}-${Date.now()}`,
      sequence: sIdx,
      localId: sIdx + 1,
      isCollapsed: false,
      actions: (s.actions || []).map((a: any, aIdx: number) => ({
        id: `act-${sIdx}-${aIdx}-${Date.now()}`,
        ...a,
        sequence: aIdx,
      })),
    }));
    setScreens(mapped);
    setNextScreenId(mapped.length + 1);
  }

  function addScreen() {
    setScreens((prev) => [
      ...prev,
      {
        id: `scr-${Date.now()}`,
        sequence: prev.length,
        localId: nextScreenId,
        isCollapsed: false,
        actions: [],
      },
    ]);
    setNextScreenId((prev) => prev + 1);
  }

  function deleteScreen(id: string) {
    setScreens((prev) => prev.filter((s) => s.id !== id));
  }

  function moveScreen(index: number, direction: "up" | "down") {
    setScreens((prev) => {
      const newScreens = [...prev];
      if (direction === "up" && index > 0) {
        [newScreens[index], newScreens[index - 1]] = [
          newScreens[index - 1],
          newScreens[index],
        ];
      } else if (direction === "down" && index < newScreens.length - 1) {
        [newScreens[index], newScreens[index + 1]] = [
          newScreens[index + 1],
          newScreens[index],
        ];
      }
      return newScreens;
    });
  }

  function toggleScreenCollapse(id: string) {
    setScreens((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, isCollapsed: !s.isCollapsed } : s,
      ),
    );
  }

  function toggleAllScreens(collapse: boolean) {
    setScreens((prev) =>
      prev.map((s) => ({ ...s, isCollapsed: collapse })),
    );
  }

  function addActionToScreen(screenId: string, type: ActionType) {
    setScreens((prev) =>
      prev.map((s) => {
        if (s.id === screenId) {
          const newActionId = `act-${Date.now()}`;
          return {
            ...s,
            actions: [
              ...s.actions,
              {
                id: newActionId,
                ...getDefaultContent(type),
                sequence: s.actions.length,
              } as Action & { id: string; sequence: number },
            ],
          };
        }
        return s;
      }),
    );
  }

  function reorderActions(
    screenId: string,
    activeId: string,
    overId: string,
  ) {
    setScreens((prev) =>
      prev.map((s) => {
        if (s.id === screenId) {
          const oldIndex = s.actions.findIndex((a) => a.id === activeId);
          const newIndex = s.actions.findIndex((a) => a.id === overId);
          return { ...s, actions: arrayMove(s.actions, oldIndex, newIndex) };
        }
        return s;
      }),
    );
  }

  function deleteAction(screenId: string, actionId: string) {
    setScreens((prev) =>
      prev.map((s) => {
        if (s.id === screenId) {
          return {
            ...s,
            actions: s.actions.filter((a) => a.id !== actionId),
          };
        }
        return s;
      }),
    );
    if (activeActionId === actionId) setActiveActionId(null);
  }

  function updateActionContent(actionId: string, updates: any) {
    setScreens((prev) =>
      prev.map((s) => ({
        ...s,
        actions: s.actions.map((a) =>
          a.id === actionId ? { ...a, ...updates } : a,
        ),
      })),
    );
  }

  function findActiveAction() {
    if (!activeActionId) return null;
    for (const screen of screens) {
      const action = screen.actions.find((a) => a.id === activeActionId);
      if (action) return action;
    }
    return null;
  }

  function getScreensPayload() {
    return screens.map((s, sIdx) => ({
      sequence: sIdx,
      actions: s.actions.map((a, aIdx) => {
        const { id, sequence, ...actionData } = a;
        return { ...actionData, sequence: aIdx };
      }),
    }));
  }

  return {
    screens,
    setScreens,
    nextScreenId,
    activeActionId,
    setActiveActionId,
    showPreview,
    setShowPreview,
    initScreens,
    addScreen,
    deleteScreen,
    moveScreen,
    toggleScreenCollapse,
    toggleAllScreens,
    addActionToScreen,
    reorderActions,
    deleteAction,
    updateActionContent,
    findActiveAction,
    getScreensPayload,
    activeAction: findActiveAction(),
  };
}
