/**
 * Excalidraw 簡易プレビュー（クラウドストレージ用）
 * importmap（index.html）経由で react / @excalidraw/excalidraw を解決する
 */

/**
 * .excalidraw JSON を読み取り専用でプレビューする
 * @param {HTMLElement} container
 * @param {Blob} blob
 * @param {string} filename
 */
export async function mountExcalidrawPreview(container, blob, filename) {
  const text = await blob.text();
  let scene;
  try {
    scene = JSON.parse(text);
  } catch {
    throw new Error("ホワイトボードファイル（.excalidraw）の形式が不正です");
  }

  const elements = Array.isArray(scene.elements) ? scene.elements : [];
  const appState =
    scene.appState && typeof scene.appState === "object" ? scene.appState : {};
  const files =
    scene.files && typeof scene.files === "object" ? scene.files : {};

  const [{ default: React }, { createRoot }, { Excalidraw }, { createExcalidrawMainMenu }] =
    await Promise.all([
      import("react"),
      import("react-dom/client"),
      import("@excalidraw/excalidraw"),
      import("../../../js/excalidraw-menu.js"),
    ]);

  container.classList.add("cs-preview-body--excalidraw");
  container.innerHTML = "";
  const mount = document.createElement("div");
  mount.className = "cs-excalidraw-preview-root";
  container.appendChild(mount);

  const uiOptions = {
    welcomeScreen: false,
    canvasActions: {
      changeViewBackgroundColor: false,
      clearCanvas: false,
      export: false,
      loadScene: false,
      saveToActiveFile: false,
      toggleTheme: false,
    },
  };

  const root = createRoot(mount);
  root.render(
    React.createElement(
      Excalidraw,
      {
        initialData: {
          elements,
          appState: {
            ...appState,
            viewModeEnabled: true,
            zenModeEnabled: true,
            collaborators: new Map(),
          },
          files,
        },
        viewModeEnabled: true,
        zenModeEnabled: true,
        langCode: "ja-JP",
        UIOptions: uiOptions,
      },
      createExcalidrawMainMenu(uiOptions)
    )
  );

  container._excalidrawPreviewRoot = root;
  void filename;
}

/** プレビューを破棄 */
export function unmountExcalidrawPreview(container) {
  if (container?._excalidrawPreviewRoot) {
    try {
      container._excalidrawPreviewRoot.unmount();
    } catch {
      /* ignore */
    }
    container._excalidrawPreviewRoot = null;
  }
  container?.classList.remove("cs-preview-body--excalidraw");
}
