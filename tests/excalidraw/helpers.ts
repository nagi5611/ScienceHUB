import type { APIRequestContext, Page } from "@playwright/test";
import { loginAsAdmin } from "../website-publish/helpers";

/** Excalidraw 矩形要素（共同編集テスト用の最小フィールド） */
export function minimalRectangle(id: string, version = 1, versionNonce = 1) {
  return {
    id,
    type: "rectangle",
    x: 120,
    y: 80,
    width: 160,
    height: 90,
    angle: 0,
    strokeColor: "#1e1e1e",
    backgroundColor: "transparent",
    fillStyle: "hachure",
    strokeWidth: 1,
    roughness: 1,
    opacity: 100,
    groupIds: [] as string[],
    frameId: null,
    roundness: { type: 3 },
    seed: 1,
    version,
    versionNonce,
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
  };
}

/** 管理者でノートを作成しシーンを PUT する */
export async function createNoteWithRectangle(
  request: APIRequestContext,
  elementId = "e2e-collab-rect"
) {
  await loginAsAdmin(request);
  const createRes = await request.post("/api/excalidraw/notes", {
    data: { title: "E2E collab delete" },
  });
  if (!createRes.ok()) {
    throw new Error(`ノート作成失敗: ${createRes.status()}`);
  }
  const { note } = (await createRes.json()) as { note: { id: string } };
  const element = minimalRectangle(elementId);
  const sceneRes = await request.put(`/api/excalidraw/notes/${note.id}/scene`, {
    data: {
      scene: {
        elements: [element],
        appState: { viewBackgroundColor: "#ffffff" },
        files: {},
      },
    },
  });
  if (!sceneRes.ok()) {
    throw new Error(`シーン PUT 失敗: ${sceneRes.status()}`);
  }
  return { noteId: note.id, elementId, element };
}

/** 共同編集 WebSocket が 503 でないことを待つ */
export async function waitForCollabAvailable(page: Page, noteId: string) {
  const probe = await page.request.get(
    `/api/excalidraw/collab?noteId=${encodeURIComponent(noteId)}`
  );
  if (probe.status() === 503) {
    throw new Error(
      "EXCALIDRAW_COLLAB が未設定です。playwright.excalidraw.config.ts または dev:all で DO を起動してください"
    );
  }
}

/** エディタ画面で共同編集ラベルが「利用不可」でないことを待つ */
export async function waitForEditorCollab(page: Page) {
  await page.waitForFunction(() => {
    const el = document.getElementById("peers-status");
    if (!el) return false;
    const text = el.textContent ?? "";
    return (
      text.length > 0 &&
      !text.includes("利用不可") &&
      !text.includes("共同編集サービスが未設定")
    );
  }, { timeout: 45_000 });
}
