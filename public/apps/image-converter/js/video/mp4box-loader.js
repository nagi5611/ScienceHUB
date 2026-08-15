/**
 * MP4Box（UMD）を script タグで読み込み、createFile を提供する
 */

/** @returns {Promise<{ createFile: Function }>} */
export function loadMP4Box() {
  const existing = /** @type {{ createFile?: Function } | undefined} */ (globalThis.MP4Box);
  if (existing?.createFile) {
    return Promise.resolve(existing);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/apps/image-converter/vendor/mp4box.all.js";
    script.async = true;
    script.onload = () => {
      const MP4Box = /** @type {{ createFile?: Function } | undefined} */ (globalThis.MP4Box);
      if (MP4Box?.createFile) {
        resolve(MP4Box);
        return;
      }
      reject(new Error("MP4Box を読み込めません"));
    };
    script.onerror = () => reject(new Error("MP4Box の読み込みに失敗しました"));
    document.head.appendChild(script);
  });
}
