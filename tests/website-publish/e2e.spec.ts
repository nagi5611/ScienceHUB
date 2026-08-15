import { test, expect } from "@playwright/test";
import {
  buildIndexHtml,
  loginAsAdmin,
  uniquePathSlug,
} from "./helpers";

test.describe("ウェブサイト公開 E2E", () => {
  test.beforeEach(async ({ request }) => {
    await loginAsAdmin(request);
  });

  test("サイト作成・ファイルアップロード・公開 URL で未認証閲覧", async ({
    page,
    request,
  }) => {
    const pathSlug = uniquePathSlug("pub");
    const createRes = await request.post("/api/website-publish/sites", {
      data: {
        title: "E2E 公開テスト",
        path_slug: pathSlug,
      },
    });
    expect(createRes.ok()).toBeTruthy();
    const { site } = await createRes.json();
    expect(site.path_slug).toBe(pathSlug);

    const html = buildIndexHtml("Hello Web Publish");
    const initRes = await request.post(
      `/api/website-publish/sites/${site.id}/upload/init`,
      {
        data: {
          filename: "index.html",
          size: new TextEncoder().encode(html).byteLength,
          relative_dir: "",
        },
      }
    );
    expect(initRes.ok()).toBeTruthy();
    const init = await initRes.json();

    const simpleRes = await request.post(
      `/api/website-publish/sites/${site.id}/upload/simple`,
      {
        headers: { "X-Upload-Session": init.sessionId },
        data: html,
      }
    );
    expect(simpleRes.ok()).toBeTruthy();

    const publicRes = await page.request.get(`/web/${pathSlug}/`);
    expect(publicRes.status()).toBe(200);
    const body = await publicRes.text();
    expect(body).toContain("Hello Web Publish");

    const listRes = await request.get("/api/website-publish/sites");
    const { sites: afterSites } = await listRes.json();
    const updated = afterSites.find((s: { path_slug: string }) => s.path_slug === pathSlug);
    expect(updated?.visit_count).toBeGreaterThanOrEqual(1);

    await request.delete(`/api/website-publish/sites/${site.id}`);
  });

  test("3サイト上限で作成拒否", async ({ request }) => {
    const listRes = await request.get("/api/website-publish/sites");
    const { sites } = await listRes.json();
    const createdIds: string[] = [];

    const need = Math.max(0, 3 - (sites?.length ?? 0));
    for (let i = 0; i < need; i++) {
      const res = await request.post("/api/website-publish/sites", {
        data: {
          title: `上限テスト ${i}`,
          path_slug: uniquePathSlug("limit"),
        },
      });
      expect(res.ok()).toBeTruthy();
      const { site } = await res.json();
      createdIds.push(site.id);
    }

    const failRes = await request.post("/api/website-publish/sites", {
      data: {
        title: "上限超過",
        path_slug: uniquePathSlug("overflow"),
      },
    });
    expect(failRes.status()).toBe(400);
    const failBody = await failRes.json();
    expect(failBody.error).toContain("3");

    for (const id of createdIds) {
      await request.delete(`/api/website-publish/sites/${id}`);
    }
  });

  test("拒否拡張子 .php はアップロード不可", async ({ request }) => {
    const pathSlug = uniquePathSlug("php");
    const createRes = await request.post("/api/website-publish/sites", {
      data: { title: "PHP 拒否", path_slug: pathSlug },
    });
    const { site } = await createRes.json();

    const initRes = await request.post(
      `/api/website-publish/sites/${site.id}/upload/init`,
      {
        data: {
          filename: "evil.php",
          size: 10,
          relative_dir: "",
        },
      }
    );
    expect(initRes.status()).toBe(400);

    await request.delete(`/api/website-publish/sites/${site.id}`);
  });

  test("ZIP アップロードで index.html を配信", async ({ page, request }) => {
    const pathSlug = uniquePathSlug("zip");
    const createRes = await request.post("/api/website-publish/sites", {
      data: { title: "ZIP テスト", path_slug: pathSlug },
    });
    const { site } = await createRes.json();

    const { zipSync } = await import("fflate");
    const html = buildIndexHtml("ZIP Site");
    const zipBytes = zipSync({
      "index.html": new TextEncoder().encode(html),
      "style.css": new TextEncoder().encode("body { color: green; }"),
    });

    const zipRes = await request.post(
      `/api/website-publish/sites/${site.id}/upload/zip`,
      {
        headers: { "Content-Type": "application/zip" },
        data: Buffer.from(zipBytes),
      }
    );
    if (!zipRes.ok()) {
      const errText = await zipRes.text();
      throw new Error(`ZIP upload failed: ${zipRes.status()} ${errText}`);
    }
    const zipBody = await zipRes.json();
    expect(zipBody.uploaded).toContain("index.html");

    const publicRes = await page.request.get(`/web/${pathSlug}/`);
    expect(publicRes.status()).toBe(200);
    expect(await publicRes.text()).toContain("ZIP Site");

    await request.delete(`/api/website-publish/sites/${site.id}`);
  });

  test("テキスト編集・名称変更・ダウンロード", async ({ page, request }) => {
    const pathSlug = uniquePathSlug("ops");
    const createRes = await request.post("/api/website-publish/sites", {
      data: { title: "操作テスト", path_slug: pathSlug },
    });
    const { site } = await createRes.json();

    const html = buildIndexHtml("Before Edit");
    const initRes = await request.post(
      `/api/website-publish/sites/${site.id}/upload/init`,
      {
        data: {
          filename: "index.html",
          size: new TextEncoder().encode(html).byteLength,
          relative_dir: "",
        },
      }
    );
    const init = await initRes.json();
    await request.post(`/api/website-publish/sites/${site.id}/upload/simple`, {
      headers: { "X-Upload-Session": init.sessionId },
      data: html,
    });

    const readRes = await request.get(
      `/api/website-publish/sites/${site.id}/files/content?path=index.html`
    );
    expect(readRes.ok()).toBeTruthy();
    const readBody = await readRes.json();
    expect(readBody.content).toContain("Before Edit");

    const edited = buildIndexHtml("After Edit");
    const putRes = await request.put(
      `/api/website-publish/sites/${site.id}/files/content`,
      { data: { path: "index.html", content: edited } }
    );
    expect(putRes.ok()).toBeTruthy();

    const publicRes = await page.request.get(`/web/${pathSlug}/`);
    expect(await publicRes.text()).toContain("After Edit");

    const renameRes = await request.patch(
      `/api/website-publish/sites/${site.id}/files/rename`,
      {
        data: {
          path: "index.html",
          new_name: "home.html",
          kind: "file",
        },
      }
    );
    expect(renameRes.ok()).toBeTruthy();

    const downloadRes = await request.get(
      `/api/website-publish/sites/${site.id}/files/download?path=home.html`
    );
    expect(downloadRes.ok()).toBeTruthy();
    expect(await downloadRes.text()).toContain("After Edit");

    await request.delete(`/api/website-publish/sites/${site.id}`);
  });
});
