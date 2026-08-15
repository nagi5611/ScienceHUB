/**

 * ラスタ変換用 Worker プール（8 並行）

 */



import { CANVAS_RASTER_FORMATS } from "./convert-core.js";

import { WorkerPool, WORKER_POOL_SIZE } from "./worker-pool.js";



/** @type {WorkerPool | null} */

let pool = null;



function getPool() {

  if (!pool) {

    pool = new WorkerPool(

      new URL("./convert-raster-worker.js", import.meta.url),

      WORKER_POOL_SIZE,

    );

  }

  return pool;

}



/**

 * Worker でラスタ画像を変換

 * @param {File} file

 * @param {{ format: import('./convert-core.js').CanvasRasterFormat, quality: number, maxEdge: number }} options

 */

export async function convertRasterInWorker(file, options) {

  const formatSpec = CANVAS_RASTER_FORMATS[options.format];

  if (!formatSpec) {

    throw new Error("出力形式が不正です");

  }



  const buffer = await file.arrayBuffer();

  const quality = Math.min(1, Math.max(0.05, options.quality / 100));



  return /** @type {Promise<Blob>} */ (

    getPool().run(

      {

        buffer,

        mime: file.type || "application/octet-stream",

        outputMime: formatSpec.mime,

        format: options.format,

        lossy: formatSpec.lossy,

        quality,

        maxEdge: options.maxEdge || 0,

      },

      [buffer],

    )

  );

}


