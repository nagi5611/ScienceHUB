/**
 * MP4 を MP4Box + WebCodecs でストリーミングデコード（ファイル全体を RAM に載せない）
 */

import { encodeVideoFrame } from "./frame-encode.js";
import { buildFrameFilename } from "./probe.js";
import { loadMP4Box } from "./mp4box-loader.js";

/** @typedef {import('./probe.js').VideoProbe} VideoProbe */

const CHUNK_SIZE = 128 * 1024 * 1024;

/**
 * トラックの codec description を取得
 * @param {object} mp4
 * @param {object} track
 */
function getCodecDescription(mp4, track) {
  const trak = mp4.getTrackById(track.id);
  const entry = trak?.mdia?.minf?.stbl?.stsd?.entries?.[0];
  if (!entry) return undefined;

  const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C;
  if (!box) return undefined;

  const DataStream = /** @type {{ new(buf?: ArrayBuffer, byteOffset?: number, endianness?: boolean): { buffer: ArrayBuffer }, BIG_ENDIAN: boolean } | undefined} */ (
    globalThis.DataStream
  );
  if (!DataStream) return undefined;

  const stream = new DataStream(undefined, 0, DataStream.BIG_ENDIAN);
  box.write(stream);
  return new Uint8Array(stream.buffer, 8);
}

/**
 * File をチャンクで MP4Box に供給
 * @param {File} file
 * @param {ReturnType<import('./mp4box-loader.js').loadMP4Box> extends Promise<infer T> ? T : never>} MP4Box
 */
async function feedMp4Box(file, mp4) {
  let offset = 0;
  while (offset < file.size) {
    const slice = file.slice(offset, offset + CHUNK_SIZE);
    const buffer = await slice.arrayBuffer();
    /** @type {ArrayBuffer & { fileStart?: number }} */ (buffer).fileStart = offset;
    offset += buffer.byteLength;
    mp4.appendBuffer(buffer);
  }
  mp4.flush();
}

/**
 * MP4 をフレーム連番で OPFS に書き出す
 * @param {File} file
 * @param {Awaited<ReturnType<import('./opfs-session.js').createOpfsSession>>} session
 * @param {{ format: 'png' | 'jpeg' | 'gif', quality: number, baseName: string }} options
 * @param {{ onProgress?: (p: { done: number, total: number }) => void }} [callbacks]
 */
export async function decodeMp4ToOpfs(file, session, options, callbacks = {}) {
  if (typeof VideoDecoder === "undefined") {
    throw new Error("WebCodecs 非対応のため MP4 のフレーム抽出ができません");
  }

  const MP4Box = await loadMP4Box();
  const mp4 = MP4Box.createFile();

  /** @type {VideoProbe} */
  const probe = {
    width: 0,
    height: 0,
    duration: 0,
    fps: 30,
    frameCount: 0,
    codec: "",
  };

  let decoder = /** @type {VideoDecoder | null} */ (null);
  let trackId = /** @type {number | null} */ (null);
  let frameIndex = 0;
  let totalFrames = 0;
  /** @type {Error | null} */
  let decodeError = null;
  /** @type {Set<Promise<void>>} */
  const pendingOutputs = new Set();

  const readyPromise = new Promise((resolve) => {
    mp4.onReady = (info) => {
      try {
        const track = info.videoTracks[0];
        if (!track) {
          throw new Error("動画トラックがありません");
        }

        trackId = track.id;
        probe.width = track.video.width;
        probe.height = track.video.height;
        probe.duration = track.duration / track.timescale;
        probe.codec = track.codec;
        probe.fps = track.nb_samples / probe.duration;
        totalFrames = track.nb_samples;
        probe.frameCount = totalFrames;

        session.setMeta({
          format: options.format,
          width: probe.width,
          height: probe.height,
          fps: probe.fps,
        });

        const description = getCodecDescription(mp4, track);

        decoder = new VideoDecoder({
          output: (frame) => {
            const task = (async () => {
              try {
                const blob = await encodeVideoFrame(frame, options.format, options.quality);
                frame.close();
                const name = buildFrameFilename(options.baseName, frameIndex, options.format);
                await session.writeFrame(frameIndex, name, blob);
                frameIndex += 1;
                if (callbacks.onProgress) {
                  callbacks.onProgress({ done: frameIndex, total: totalFrames });
                }
              } catch (error) {
                decodeError = error instanceof Error ? error : new Error(String(error));
                decoder?.close();
              }
            })();
            pendingOutputs.add(task);
            void task.finally(() => pendingOutputs.delete(task));
          },
          error: (error) => {
            decodeError = error;
          },
        });

        decoder.configure({
          codec: track.codec,
          codedWidth: track.video.width,
          codedHeight: track.video.height,
          description,
        });

        mp4.setExtractionOptions(trackId, null, { nbSamples: 100 });
        mp4.start();
      } catch (error) {
        decodeError = error instanceof Error ? error : new Error(String(error));
      } finally {
        resolve();
      }
    };

    mp4.onError = (error) => {
      decodeError = error instanceof Error ? error : new Error(String(error));
      resolve();
    };

    mp4.onSamples = (id, _user, samples) => {
      if (!decoder || decodeError || id !== trackId) return;

      for (const sample of samples) {
        const chunk = new EncodedVideoChunk({
          type: sample.is_sync ? "key" : "delta",
          timestamp: (1_000_000 * sample.cts) / sample.timescale,
          duration: (1_000_000 * sample.duration) / sample.timescale,
          data: sample.data,
        });
        decoder.decode(chunk);
      }

      if (trackId != null && samples.length > 0) {
        mp4.releaseUsedSamples(trackId, samples[0].number, samples.length);
      }
    };
  });

  await feedMp4Box(file, mp4);
  await readyPromise;

  if (decodeError) {
    throw decodeError;
  }
  if (!decoder) {
    throw new Error("MP4 の解析に失敗しました");
  }

  await decoder.flush();
  await Promise.all([...pendingOutputs]);
  decoder.close();

  if (frameIndex === 0) {
    throw new Error("フレームを抽出できませんでした");
  }

  return { probe, frameCount: frameIndex };
}

/** MP4 + WebCodecs が使えるか */
export function canUseMp4WebCodecs() {
  return typeof VideoDecoder !== "undefined";
}
