// functions/lib/simulation/fds-rerun.ts

import type { Env } from "../types";
import { createId } from "../types";
import { duplicateFdsInputFile } from "./fds-input";
import {
  canRerunFdsRequest,
  createFdsRequest,
  getFdsRequestById,
  type FdsRequest,
} from "./fds-requests";
import { getFdsJobById } from "./fds-jobs";

/** Creates a new FDS request by copying input and settings from a completed run. */
export async function createFdsRerunFromRequest(
  env: Env,
  db: D1Database,
  sourceRequestId: string,
  userId: string,
  options: { title?: string; desiredDate?: string | null } = {}
): Promise<FdsRequest> {
  const source = await getFdsRequestById(db, sourceRequestId);
  if (!source || source.user_id !== userId) {
    throw new Error("依頼が見つかりません");
  }

  const job = source.fds_job_id ? await getFdsJobById(db, source.fds_job_id) : null;
  if (!canRerunFdsRequest(source, job)) {
    throw new Error("実行が完了した依頼のみ、同条件で再依頼できます");
  }

  const newId = createId("fdsreq");
  const copied = await duplicateFdsInputFile(
    env.FILES,
    source.input_r2_key,
    newId,
    source.input_filename
  );

  const createdAt = new Date().toISOString();
  const title = options.title?.trim() || `${source.title}（再依頼）`;

  const row = await createFdsRequest(db, {
    id: newId,
    userId,
    title,
    desiredDate: options.desiredDate !== undefined ? options.desiredDate : source.desired_date,
    maxRuntimeHours: source.max_runtime_hours,
    mpiProcesses: source.mpi_processes,
    inputR2Key: copied.r2Key,
    inputFilename: copied.filename,
    inputSizeBytes: copied.size,
    inputSha256: copied.sha256,
    notes: source.notes,
    createdAt,
    status: "primary_reviewing",
  });

  return row;
}
