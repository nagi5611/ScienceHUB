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
    const status = page.locator("#display-card-layout-status");
    await expect(status).not.toHaveText("読み込み中…", { timeout: 30_000 });
    await expect(page.getByTestId("display-card-root")).toBeVisible({ timeout: 30_000 });
    await expect(page.locator(".contest-display-card--editor")).toBeVisible();
  });

  test("作品タイトルテキストをドラッグすると left が変わる", async ({ page }) => {
    const title = page.getByTestId("display-card-title");
    await expect(title).toHaveText("テストタイトル");

    await expect
      .poll(async () => title.evaluate((el) => getComputedStyle(el).pointerEvents))
      .toBe("auto");

    const beforeLeft = await title.evaluate((el) => el.style.left);
    await dispatchLayoutDrag(page, '[data-testid="display-card-title"]', 52, 16);

    await expect
      .poll(async () => title.evaluate((el) => el.style.left))
      .not.toBe(beforeLeft);
  });

  test("コメント1行目ハンドルのXだけ動かしても2行目のXは変わらない", async ({ page }) => {
    const handle0 = page.locator('.display-card-layout-handle[data-layout-key="comment.line.0"]');
    const handle1 = page.locator('.display-card-layout-handle[data-layout-key="comment.line.1"]');
    await expect(handle0).toBeVisible();
    await expect(handle1).toBeVisible();

    await dispatchLayoutDrag(page, '.display-card-layout-handle[data-layout-key="comment.line.0"]', 36, 0);
    const left1AfterSetup = await handle1.evaluate((el) => el.style.left);
    const left0Before = await handle0.evaluate((el) => el.style.left);

    await dispatchLayoutDrag(page, '.display-card-layout-handle[data-layout-key="comment.line.0"]', -24, 0);

    await expect
      .poll(async () => handle0.evaluate((el) => el.style.left))
      .not.toBe(left0Before);
    await expect
      .poll(async () => handle1.evaluate((el) => el.style.left))
      .toBe(left1AfterSetup);
  });

  test("コメント行数を増やすと行ハンドルが増える", async ({ page }) => {
    await page.getByRole("button", { name: "コメント枠" }).click();
    const maxInput = page.locator('[data-prop-input="maxLines"]');
    await expect(maxInput).toBeVisible();
    await maxInput.fill("8");
    await maxInput.dispatchEvent("change");
    await expect(
      page.locator('.display-card-layout-handle[data-layout-key="comment.line.7"]')
    ).toBeVisible();
    await expect(
      page.locator('.display-card-layout-handle[data-layout-key="comment.line.7.right"]')
    ).toBeVisible();
  });

  test("右端スライダーを動かすとコメント行の分割が変わる", async ({ page }) => {
    await page.evaluate(() => {
      document
        .querySelector('[data-testid="display-card-comment-line-0"]')
        ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const slider = page.locator('[data-range-input="lineRight"]');
    await expect(slider).toBeVisible({ timeout: 10_000 });

    const line0 = page.getByTestId("display-card-comment-line-0");
    const before = await line0.textContent();
    const currentRight = parseFloat(await slider.inputValue());
    const minRight = parseFloat((await slider.getAttribute("min")) ?? "24");
    const narrower = String(Math.max(minRight + 1, currentRight - 12));
    await slider.fill(narrower);
    await slider.dispatchEvent("input");

    await expect.poll(async () => line0.textContent()).not.toBe(before);
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
