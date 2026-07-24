/**
 * プロジェクト管理 API
 * GET    /api/project-management
 * PUT    /api/project-management              — 管理者設定
 * POST   /api/project-management/projects
 * DELETE /api/project-management/projects/:id
 * PUT    /api/project-management/projects/:id — 納期・担当更新
 * POST   /api/project-management/projects/:id/note — Excalidraw ノート取得/作成
 * PUT    /api/project-management/availability
 * GET    /api/project-management/projects/:id/effort?due_date=
 * GET    /api/project-management/task-effort?group_id=&due_date=&assignee_ids=
 */

import type { Env } from "../../lib/types";
import { getDb } from "../../lib/db";
import { requireUser } from "../../lib/auth";
import { jsonError } from "../../lib/types";
import { canUserAccessApp } from "../../lib/apps";
import {
  getProjectDashboard,
  updateAdminSettings,
  createProject,
  deleteProject,
  setAvailability,
  updateChildSchedule,
  setChildAssignees,
  setChildCompleted,
  setChildStoragePath,
  setParentLeader,
  setParentLeaders,
  setParentMembers,
  setParentProgress,
  createTask,
  completeTask,
  updateTask,
  updateIssuedTaskBatch,
  setIssuedTaskActivityDayAssignees,
  previewActivityDayAssignmentConflicts,
  ActivityScheduleConflictError,
  deleteIssuedTaskBatch,
  deleteTask,
  getGroupStorageRootPath,
  previewEffort,
  previewTaskIssueEffort,
  getOrCreateProjectNote,
  PROJECT_APP_SLUG,
} from "../../lib/project-management";

/** ログインとプロジェクト管理アプリへのアクセス権を検証 */
async function requireProjectAppAccess(
  request: Request,
  env: Env
): Promise<{ id: string } | Response> {
  const auth = await requireUser(request, env);
  if (auth instanceof Response) return auth;

  const allowed = await canUserAccessApp(
    getDb(env),
    auth.id,
    PROJECT_APP_SLUG
  );
  if (!allowed) {
    return jsonError("このアプリへのアクセス権限がありません", 403);
  }

  return { id: auth.id };
}

/** パスセグメントを正規化 */
function pathParts(params: string | string[] | undefined): string[] {
  if (!params) return [];
  const raw = Array.isArray(params) ? params : [params];
  return raw
    .flatMap((p) => String(p).split("/"))
    .map((p) => p.trim())
    .filter(Boolean);
}

/** エラーを JSON レスポンスに変換 */
function toErrorResponse(error: unknown, fallback: string): Response {
  const message = error instanceof Error ? error.message : fallback;
  const status =
    message.includes("権限") || message.includes("所属") ? 403 : 400;
  return jsonError(message, status);
}

interface AdminSettingsBody {
  group_id?: string;
  min_eligible_weight?: number;
}

interface CreateProjectBody {
  group_id?: string;
  name?: string;
  parent_id?: string | null;
}

interface AvailabilityBody {
  group_id?: string;
  dates?: string[];
  available?: boolean;
}

interface UpdateProjectBody {
  due_date?: string | null;
  start_date?: string | null;
  assignee_ids?: string[];
  completed?: boolean;
  storage_path?: string | null;
  leader_user_id?: string | null;
  leader_user_ids?: string[];
  member_user_ids?: string[];
  progress_percent?: number | null;
}

interface CreateTaskBody {
  group_id?: string;
  parent_project_id?: string | null;
  child_project_id?: string | null;
  title?: string;
  description?: string;
  due_date?: string | null;
  status?: "pending" | "active";
  assignee_id?: string;
  assignee_ids?: string[];
  activity_dates?: string[];
  storage_path?: string | null;
}

interface UpdateTaskBody {
  title?: string;
  description?: string;
  due_date?: string | null;
  status?: "pending" | "active";
  child_project_id?: string | null;
  storage_path?: string | null;
}

interface UpdateIssuedTaskBatchBody {
  title?: string;
  due_date?: string | null;
  status?: "pending" | "active";
  child_project_id?: string | null;
  assignee_ids?: string[];
  activity_dates?: string[];
  storage_path?: string | null;
}

interface SetActivityDayAssigneesBody {
  activity_date?: string;
  user_ids?: string[];
  acknowledge_conflicts?: boolean;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = await requireProjectAppAccess(context.request, context.env);
  if (auth instanceof Response) return auth;

  const parts = pathParts(context.params.path);
  const db = getDb(context.env);

  // GET /api/project-management/storage-root?group_id=
  if (parts.length === 1 && parts[0] === "storage-root") {
    const url = new URL(context.request.url);
    const gid = url.searchParams.get("group_id")?.trim() ?? "";
    if (!gid) {
      return jsonError("group_id を指定してください", 400);
    }
    try {
      const path = await getGroupStorageRootPath(db, gid);
      return Response.json({ path });
    } catch (error) {
      return toErrorResponse(error, "ストレージルートの取得に失敗しました");
    }
  }

  // GET /api/project-management/task-effort?group_id=&due_date=&assignee_ids=
  if (parts.length === 1 && parts[0] === "task-effort") {
    const url = new URL(context.request.url);
    const groupId = url.searchParams.get("group_id")?.trim() ?? "";
    const dueDate = url.searchParams.get("due_date");
    const assigneeIds = url.searchParams.getAll("assignee_ids");
    const activityDates = url.searchParams.getAll("activity_dates");
    try {
      const data = await previewTaskIssueEffort(
        db,
        auth.id,
        groupId,
        dueDate,
        assigneeIds,
        activityDates
      );
      return Response.json(data);
    } catch (error) {
      return toErrorResponse(error, "工数の取得に失敗しました");
    }
  }

  // GET /api/project-management/projects/:id/effort?due_date=
  if (
    parts.length === 3 &&
    parts[0] === "projects" &&
    parts[2] === "effort"
  ) {
    const projectId = parts[1] ?? "";
    const url = new URL(context.request.url);
    const dueDate = url.searchParams.get("due_date");
    const startDate = url.searchParams.get("start_date");
    try {
      const data = await previewEffort(
        db,
        auth.id,
        projectId,
        dueDate,
        startDate === null ? undefined : startDate
      );
      return Response.json(data);
    } catch (error) {
      return toErrorResponse(error, "工数の取得に失敗しました");
    }
  }

  // GET /api/project-management/task-batches/:id/activity-schedule-conflicts
  if (
    parts.length === 3 &&
    parts[0] === "task-batches" &&
    parts[2] === "activity-schedule-conflicts"
  ) {
    const batchId = parts[1] ?? "";
    if (!batchId) {
      return jsonError("バッチ ID が不正です", 400);
    }
    const url = new URL(context.request.url);
    const activityDate = url.searchParams.get("activity_date")?.trim() ?? "";
    const userIds = url.searchParams.getAll("user_ids");
    if (!activityDate) {
      return jsonError("activity_date を指定してください", 400);
    }
    try {
      const data = await previewActivityDayAssignmentConflicts(
        db,
        auth.id,
        batchId,
        activityDate,
        userIds
      );
      return Response.json(data);
    } catch (error) {
      return toErrorResponse(error, "重複の確認に失敗しました");
    }
  }

  if (parts.length > 0) {
    return jsonError("不正なパスです", 404);
  }

  const url = new URL(context.request.url);
  const groupId = url.searchParams.get("group_id");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  try {
    const data = await getProjectDashboard(
      db,
      auth.id,
      groupId,
      from,
      to
    );
    return Response.json(data);
  } catch (error) {
    return toErrorResponse(error, "ダッシュボードの取得に失敗しました");
  }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const auth = await requireProjectAppAccess(context.request, context.env);
  if (auth instanceof Response) return auth;

  const parts = pathParts(context.params.path);
  const db = getDb(context.env);

  if (parts.length === 0) {
    let body: AdminSettingsBody;
    try {
      body = await context.request.json<AdminSettingsBody>();
    } catch {
      return jsonError("リクエスト形式が不正です", 400);
    }

    const groupId = body.group_id?.trim() ?? "";
    if (!groupId) {
      return jsonError("group_id を指定してください", 400);
    }
    if (typeof body.min_eligible_weight !== "number") {
      return jsonError("min_eligible_weight を指定してください", 400);
    }

    try {
      const group = await updateAdminSettings(
        db,
        auth.id,
        groupId,
        body.min_eligible_weight
      );
      return Response.json({ group });
    } catch (error) {
      return toErrorResponse(error, "管理者設定の更新に失敗しました");
    }
  }

  if (parts.length === 1 && parts[0] === "availability") {
    let body: AvailabilityBody;
    try {
      body = await context.request.json<AvailabilityBody>();
    } catch {
      return jsonError("リクエスト形式が不正です", 400);
    }

    const groupId = body.group_id?.trim() ?? "";
    if (!groupId) {
      return jsonError("group_id を指定してください", 400);
    }
    if (!Array.isArray(body.dates) || body.dates.length === 0) {
      return jsonError("dates を指定してください", 400);
    }
    if (typeof body.available !== "boolean") {
      return jsonError("available を指定してください", 400);
    }

    try {
      const availability = await setAvailability(db, auth.id, {
        group_id: groupId,
        dates: body.dates,
        available: body.available,
      });
      return Response.json({ availability, available: body.available });
    } catch (error) {
      return toErrorResponse(error, "活動可能日の更新に失敗しました");
    }
  }

  // PUT /api/project-management/projects/:id
  if (parts.length === 2 && parts[0] === "projects") {
    const projectId = parts[1] ?? "";
    let body: UpdateProjectBody;
    try {
      body = await context.request.json<UpdateProjectBody>();
    } catch {
      return jsonError("リクエスト形式が不正です", 400);
    }

    try {
      let projects;
      if (body.progress_percent !== undefined) {
        if (
          body.progress_percent !== null &&
          typeof body.progress_percent !== "number"
        ) {
          return jsonError(
            "progress_percent は数値または null で指定してください",
            400
          );
        }
        projects = await setParentProgress(
          db,
          auth.id,
          projectId,
          body.progress_percent
        );
      } else if (body.leader_user_ids !== undefined) {
        if (!Array.isArray(body.leader_user_ids)) {
          return jsonError("leader_user_ids は配列で指定してください", 400);
        }
        projects = await setParentLeaders(
          db,
          auth.id,
          projectId,
          body.leader_user_ids
        );
      } else if (body.member_user_ids !== undefined) {
        if (!Array.isArray(body.member_user_ids)) {
          return jsonError("member_user_ids は配列で指定してください", 400);
        }
        projects = await setParentMembers(
          db,
          auth.id,
          projectId,
          body.member_user_ids
        );
      } else if (body.leader_user_id !== undefined) {
        projects = await setParentLeader(
          db,
          auth.id,
          projectId,
          body.leader_user_id
        );
      } else if (body.assignee_ids !== undefined) {
        if (!Array.isArray(body.assignee_ids)) {
          return jsonError("assignee_ids は配列で指定してください", 400);
        }
        projects = await setChildAssignees(
          db,
          auth.id,
          projectId,
          body.assignee_ids
        );
      } else if (body.completed !== undefined) {
        if (typeof body.completed !== "boolean") {
          return jsonError("completed は boolean で指定してください", 400);
        }
        projects = await setChildCompleted(
          db,
          auth.id,
          projectId,
          body.completed
        );
      } else if (body.storage_path !== undefined) {
        projects = await setChildStoragePath(
          db,
          auth.id,
          projectId,
          body.storage_path
        );
      } else if (
        body.due_date !== undefined ||
        body.start_date !== undefined
      ) {
        projects = await updateChildSchedule(db, auth.id, projectId, {
          due_date: body.due_date,
          start_date: body.start_date,
        });
      } else {
        return jsonError(
          "due_date / start_date / assignee_ids / completed / storage_path / leader_user_ids / member_user_ids / progress_percent のいずれかを指定してください",
          400
        );
      }
      return Response.json({ projects });
    } catch (error) {
      return toErrorResponse(error, "プロジェクトの更新に失敗しました");
    }
  }

  // PUT /api/project-management/task-batches/:id/activity-day-assignees
  if (
    parts.length === 3 &&
    parts[0] === "task-batches" &&
    parts[2] === "activity-day-assignees"
  ) {
    const batchId = parts[1] ?? "";
    if (!batchId) {
      return jsonError("バッチ ID が不正です", 400);
    }
    let body: SetActivityDayAssigneesBody;
    try {
      body = await context.request.json<SetActivityDayAssigneesBody>();
    } catch {
      return jsonError("リクエスト形式が不正です", 400);
    }
    const activityDate = body.activity_date?.trim() ?? "";
    if (!activityDate) {
      return jsonError("activity_date を指定してください", 400);
    }
    const userIds = Array.isArray(body.user_ids)
      ? body.user_ids.map((id) => String(id ?? "").trim()).filter(Boolean)
      : [];

    try {
      const result = await setIssuedTaskActivityDayAssignees(
        db,
        auth.id,
        batchId,
        {
          activity_date: activityDate,
          user_ids: userIds,
          acknowledge_conflicts: body.acknowledge_conflicts === true,
        }
      );
      return Response.json(result);
    } catch (error) {
      if (error instanceof ActivityScheduleConflictError) {
        return Response.json(
          { error: error.message, conflicts: error.conflicts },
          { status: 409 }
        );
      }
      return toErrorResponse(error, "活動日の担当者設定に失敗しました");
    }
  }

  // PUT /api/project-management/task-batches/:id
  if (parts.length === 2 && parts[0] === "task-batches") {
    const batchId = parts[1] ?? "";
    if (!batchId) {
      return jsonError("バッチ ID が不正です", 400);
    }
    let body: UpdateIssuedTaskBatchBody;
    try {
      body = await context.request.json<UpdateIssuedTaskBatchBody>();
    } catch {
      return jsonError("リクエスト形式が不正です", 400);
    }

    try {
      const result = await updateIssuedTaskBatch(db, auth.id, batchId, body);
      return Response.json(result);
    } catch (error) {
      return toErrorResponse(error, "発行タスクの更新に失敗しました");
    }
  }

  // PUT /api/project-management/tasks/:id
  if (parts.length === 2 && parts[0] === "tasks") {
    const taskId = parts[1] ?? "";
    let body: UpdateTaskBody;
    try {
      body = await context.request.json<UpdateTaskBody>();
    } catch {
      return jsonError("リクエスト形式が不正です", 400);
    }

    try {
      const result = await updateTask(db, auth.id, taskId, body);
      return Response.json(result);
    } catch (error) {
      return toErrorResponse(error, "タスクの更新に失敗しました");
    }
  }

  // PUT /api/project-management/tasks/:id/complete
  if (
    parts.length === 3 &&
    parts[0] === "tasks" &&
    parts[2] === "complete"
  ) {
    const taskId = parts[1] ?? "";
    try {
      const result = await completeTask(db, auth.id, taskId);
      return Response.json(result);
    } catch (error) {
      return toErrorResponse(error, "タスクの完了に失敗しました");
    }
  }

  return jsonError("不正なパスです", 404);
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const auth = await requireProjectAppAccess(context.request, context.env);
  if (auth instanceof Response) return auth;

  const parts = pathParts(context.params.path);
  const db = getDb(context.env);

  // POST /api/project-management/tasks
  if (parts.length === 1 && parts[0] === "tasks") {
    let body: CreateTaskBody;
    try {
      body = await context.request.json<CreateTaskBody>();
    } catch {
      return jsonError("リクエスト形式が不正です", 400);
    }

    const parentId = body.parent_project_id?.trim() ?? "";
    const title = body.title?.trim() ?? "";
    const assigneeIds = Array.isArray(body.assignee_ids)
      ? body.assignee_ids.map((id) => String(id ?? "").trim()).filter(Boolean)
      : body.assignee_id?.trim()
        ? [body.assignee_id.trim()]
        : [];
    const groupId = body.group_id?.trim() ?? "";
    if (!title) {
      return jsonError("title を指定してください", 400);
    }
    if (assigneeIds.length === 0) {
      return jsonError("assignee_id または assignee_ids を指定してください", 400);
    }
    if (!parentId && !groupId) {
      return jsonError("group_id または parent_project_id を指定してください", 400);
    }

    try {
      const result = await createTask(db, auth.id, {
        group_id: groupId || undefined,
        parent_project_id: parentId || null,
        child_project_id: body.child_project_id,
        title,
        description: body.description,
        due_date: body.due_date,
        status: body.status,
        assignee_ids: assigneeIds,
        activity_dates: body.activity_dates,
        storage_path: body.storage_path,
      });
      return Response.json(result);
    } catch (error) {
      return toErrorResponse(error, "タスクの作成に失敗しました");
    }
  }

  // POST /api/project-management/projects/:id/note
  if (parts.length === 3 && parts[0] === "projects" && parts[2] === "note") {
    const projectId = parts[1] ?? "";
    if (!projectId) {
      return jsonError("プロジェクト ID が不正です", 400);
    }
    try {
      const result = await getOrCreateProjectNote(db, auth.id, projectId);
      return Response.json(result);
    } catch (error) {
      return toErrorResponse(error, "ノートの取得に失敗しました");
    }
  }

  if (!(parts.length === 1 && parts[0] === "projects")) {
    return jsonError("不正なパスです", 404);
  }

  let body: CreateProjectBody;
  try {
    body = await context.request.json<CreateProjectBody>();
  } catch {
    return jsonError("リクエスト形式が不正です", 400);
  }

  const groupId = body.group_id?.trim() ?? "";
  const name = body.name?.trim() ?? "";
  if (!groupId) {
    return jsonError("group_id を指定してください", 400);
  }
  if (!name) {
    return jsonError("name を指定してください", 400);
  }

  try {
    const projects = await createProject(db, auth.id, {
      group_id: groupId,
      name,
      parent_id: body.parent_id ?? null,
    });
    return Response.json({ projects });
  } catch (error) {
    return toErrorResponse(error, "プロジェクトの作成に失敗しました");
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const auth = await requireProjectAppAccess(context.request, context.env);
  if (auth instanceof Response) return auth;

  const parts = pathParts(context.params.path);
  const db = getDb(context.env);

  if (parts.length === 2 && parts[0] === "task-batches") {
    const batchId = parts[1] ?? "";
    if (!batchId) {
      return jsonError("バッチ ID が不正です", 400);
    }
    try {
      const result = await deleteIssuedTaskBatch(db, auth.id, batchId);
      return Response.json(result);
    } catch (error) {
      return toErrorResponse(error, "発行タスクの削除に失敗しました");
    }
  }

  if (parts.length === 2 && parts[0] === "tasks") {
    const taskId = parts[1] ?? "";
    if (!taskId) {
      return jsonError("タスク ID が不正です", 400);
    }
    try {
      const result = await deleteTask(db, auth.id, taskId);
      return Response.json(result);
    } catch (error) {
      return toErrorResponse(error, "タスクの削除に失敗しました");
    }
  }

  if (!(parts.length === 2 && parts[0] === "projects")) {
    return jsonError("不正なパスです", 404);
  }

  const projectId = parts[1] ?? "";
  if (!projectId) {
    return jsonError("プロジェクト ID が不正です", 400);
  }

  try {
    const projects = await deleteProject(
      getDb(context.env),
      auth.id,
      projectId
    );
    return Response.json({ projects });
  } catch (error) {
    return toErrorResponse(error, "プロジェクトの削除に失敗しました");
  }
};
