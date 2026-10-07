import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers";

async function dispatchLayoutDrag(
  page: import("@playwright/test").Page,
  selector: string,
  deltaX: number,
  deltaY: number
) {
  await page.evaluate(
    ({ sel, dx, dy }) => {
      const el = document.querySelector(sel);
      const card = el?.closest(".contest-display-card");
      if (!el || !card) throw new Error(`drag target missing: ${sel}`);
      const rect = el.getBoundingClientRect();
      const pointerId = 7;
      const startX = rect.left + Math.min(12, rect.width / 3);
      const startY = rect.top + rect.height / 2;
      el.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          clientX: startX,
          clientY: startY,
          pointerId,
          pointerType: "mouse",
          isPrimary: true,
        })
      );
      window.dispatchEvent(
        new PointerEvent("pointermove", {
          clientX: startX + dx,
          clientY: startY + dy,
          pointerId,
          pointerType: "mouse",
          isPrimary: true,
        })
      );
      window.dispatchEvent(
        new PointerEvent("pointerup", {
          pointerId,
          pointerType: "mouse",
          isPrimary: true,
        })
      );
    },
    { sel: selector, dx: deltaX, dy: deltaY }
  );
}

test.describe("造形物コンテスト管理 — 展示カードレイアウト", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page.request);
    await page.goto("/apps/contest-management/");
    await page.locator('.admin-menu-item[data-panel="display-card-layout"]').click();
    await expect(page.locator("#panel-display-card-layout")).toBeVisible();
    await expect(page.getByTestId("display-card-root")).toBeVisible();
    await expect(page.locator(".contest-display-card--editor")).toBeVisible();
  });

  test("作品タイトルテキストをドラッグすると left が変わる", async ({ page }) => {
    const title = page.getByTestId("display-card-title");
    await expect(title).toHaveText("テストタイトル");

    const pointerEvents = await title.evaluate((el) => getComputedStyle(el).pointerEvents);
    expect(pointerEvents).toBe("auto");

    const beforeLeft = await title.evaluate((el) => el.style.left);
    await dispatchLayoutDrag(page, '[data-testid="display-card-title"]', 52, 16);

    await expect
      .poll(async () => title.evaluate((el) => el.style.left))
      .not.toBe(beforeLeft);
  });

  test("作品名ハンドルをドラッグすると位置が変わる", async ({ page }) => {
    const handle = page.locator('.display-card-layout-handle[data-layout-key="title"]');
    await expect(handle).toBeVisible();

    const beforeTop = await handle.evaluate((el) => el.style.top);
    await dispatchLayoutDrag(page, '.display-card-layout-handle[data-layout-key="title"]', 0, 34);

    await expect
      .poll(async () => handle.evaluate((el) => el.style.top))
      .not.toBe(beforeTop);
  });
});
