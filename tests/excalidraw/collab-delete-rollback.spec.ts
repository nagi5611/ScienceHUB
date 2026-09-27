import { test, expect } from "@playwright/test";
import { reconcileElements } from "../../public/js/excalidraw-collab-utils.js";
import {
  createNoteWithRectangle,
  minimalRectangle,
} from "./helpers";
import { loginAsAdmin } from "../website-publish/helpers";

test.describe("Excalidraw 共同編集 — 削除ロールバック", () => {
  test("DO と同一の reconcileElements で tombstone が古い版を拒否する", () => {
    const id = "do-identical-reconcile";
    const deleted = {
      ...minimalRectangle(id, 2, 2),
      isDeleted: true,
    };
    const staleAlive = minimalRectangle(id, 1, 1);

    const doStateAfterDelete = reconcileElements([], [deleted]);
    expect(doStateAfterDelete).toHaveLength(1);
    expect(doStateAfterDelete[0]?.isDeleted).toBe(true);

    const doStateAfterStale = reconcileElements(doStateAfterDelete, [
      staleAlive,
    ]);
    expect(doStateAfterStale).toHaveLength(1);
    expect(doStateAfterStale[0]?.isDeleted).toBe(true);
  });

  test("D1: 削除済みシーンのあと古い PUT でも tombstone が保持される", async ({
    page,
  }) => {
    await loginAsAdmin(page.request);
    const { noteId, elementId, element } = await createNoteWithRectangle(
      page.request
    );

    const deletedScene = {
      elements: [{ ...element, version: 2, versionNonce: 2, isDeleted: true }],
      appState: { viewBackgroundColor: "#ffffff" },
      files: {},
    };
    const putDeleted = await page.request.put(
      `/api/excalidraw/notes/${noteId}/scene`,
      { data: { scene: deletedScene } }
    );
    expect(putDeleted.ok()).toBeTruthy();

    const putStale = await page.request.put(
      `/api/excalidraw/notes/${noteId}/scene`,
      {
        data: {
          scene: {
            elements: [element],
            appState: { viewBackgroundColor: "#ffffff" },
            files: {},
          },
        },
      }
    );
    expect(putStale.ok()).toBeTruthy();

    const getRes = await page.request.get(`/api/excalidraw/notes/${noteId}`);
    const body = (await getRes.json()) as {
      note: { scene: { elements: { id: string; isDeleted?: boolean }[] } };
    };
    const stored = body.note.scene.elements.filter((el) => el.id === elementId);
    expect(stored).toHaveLength(1);
    expect(stored[0]?.isDeleted).toBe(true);
  });
});
