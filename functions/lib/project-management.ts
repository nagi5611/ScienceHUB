/**
 * プロジェクト管理 — グループ単位の管理者判定・親子プロジェクト・活動可能日
 */

import { createId, now } from "./types";
import {
  getUserGroupMemberships,
  type UserGroupMembership,
} from "./groups";
import {
  canUserAccessApp,
  getAppBySlug,
  loadAppAccessMeta,
  membershipCanAccessApp,
} from "./apps";
import { userHasAdminRole } from "./roles";
import { createGroupNote } from "./excalidraw-notes";

export const PROJECT_APP_SLUG = "project-management";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export interface PmGroupRole {
  id: string;
  slug: string;
  display_name: string;
  color: string;
  weight: number;
}

export interface PmGroupSummary {
  id: string;
  slug: string;
  display_name: string;
  color: string;
  my_role: {
    id: string;
    slug: string;
    display_name: string;
    color: string;
    weight: number;
  };
  is_admin: boolean;
  max_weight: number;
  min_eligible_weight: number;
}

export type PmTaskStatus = "pending" | "active";

export interface PmTask {
  id: string;
  title: string;
  description: string;
  parent_project_id: string | null;
  parent_name: string | null;
  child_project_id: string | null;
  child_name: string | null;
  due_date: string | null;
  status: PmTaskStatus;
  /** status === 'active' かつ未完了 */
  is_active: boolean;
  /** status === 'pending' かつ未完了 */
  is_pending: boolean;
  assignee: PmAssignee;
  created_by: PmAssignee;
  is_completed: boolean;
  /** 完了日時（Unix ms）。未完了なら null */
  completed_at: number | null;
  due_urgency: PmDueUrgency;
  created_at: number;
}

export interface PmMemberBoard {
  member: PmMember;
  active_tasks: PmTask[];
  pending_tasks: PmTask[];
  /** 自分または管理者がタスクを追加できる */
  can_add: boolean;
}

export interface PmMember {
  id: string;
  display_name: string;
  username: string;
}

export interface PmAssignee {
  id: string;
  display_name: string;
  username: string;
}

export type PmDueUrgency = "ok" | "warning" | "overdue" | null;

export interface PmChildProject {
  id: string;
  name: string;
  position: number;
  /** 明示設定された開始予定日（未設定なら null） */
  start_date: string | null;
  /** 実効開始日（start_date または作成日） */
  effective_start_date: string;
  due_date: string | null;
  completed_at: number | null;
  is_completed: boolean;
  /** 開始済みかつ未達成 */
  is_active: boolean;
  /** 開始前かつ未達成 */
  is_pending: boolean;
  due_urgency: PmDueUrgency;
  assignees: PmAssignee[];
  /** 開始日〜納期（または今日〜納期）の担当者活動可能日合計 */
  effort_days: number | null;
  /** 紐づいたグループストレージの論理パス（例: g/lab-a/docs） */
  storage_path: string | null;
  /** プロジェクト用 Excalidraw ノート ID */
  excalidraw_note_id: string | null;
}

export interface PmParentProject {
  id: string;
  name: string;
  position: number;
  /** @deprecated leaders を使用。先頭リーダー（互換） */
  leader: PmAssignee | null;
  /** 親プロジェクトのリーダー（複数可） */
  leaders: PmAssignee[];
  /** 親プロジェクトの担当者（リーダーがグループメンバーから管理） */
  members: PmAssignee[];
  /** 現ユーザーがこの親のリーダーか */
  is_leader: boolean;
  children: PmChildProject[];
  completed_children: PmChildProject[];
  /** 子の達成率 0–100（手動上書きがあればそちら） */
  progress_percent: number;
  child_total: number;
  child_completed: number;
  /** 進捗が手動設定か（false なら子の達成率） */
  progress_manual: boolean;
  /** 親の最終更新（Unix ms） */
  updated_at: number;
  /** 子の最遅納期（YYYY-MM-DD） */
  latest_due_date: string | null;
  /** プロジェクト用 Excalidraw ノート ID */
  excalidraw_note_id: string | null;
}

export type PmActivityAction =
  | "created_parent"
  | "created_child"
  | "completed_child"
  | "reopened_child"
  | "deleted_project"
  | "created_task"
  | "completed_task";

export interface PmActivity {
  id: string;
  group_id: string;
  parent_project_id: string | null;
  parent_name: string | null;
  actor: PmAssignee;
  action: PmActivityAction;
  target_type: "parent" | "child" | "task";
  target_id: string | null;
  target_name: string;
  created_at: number;
}

export type PmAvailabilityStatus = "available" | "unavailable";

export interface PmAvailabilityEntry {
  date: string;
  status: PmAvailabilityStatus;
}

/** 日付ごとの活動可能メンバー（グループ閲覧用） */
export interface PmGroupAvailabilityDay {
  date: string;
  members: PmMember[];
}

export interface PmDashboard {
  group: PmGroupSummary;
  groups: PmGroupSummary[];
  /** 現ユーザーに振られた未完了タスク */
  tasks: PmTask[];
  /** 現ユーザーに振られた達成済みタスク（直近） */
  completed_tasks: PmTask[];
  projects: PmParentProject[];
  members: PmMember[];
  availability: PmAvailabilityEntry[];
  /** 表示月のグループメンバー活動可能日（閲覧用） */
  group_availability: PmGroupAvailabilityDay[];
  roles: PmGroupRole[];
  can_edit_admin_settings: boolean;
  current_user_id: string;
  recent_activity: PmActivity[];
  member_board: PmMemberBoard[];
}

interface MemberWeightRow {
  user_id: string;
  weight: number;
}

interface AdminSettingsRow {
  group_id: string;
  min_eligible_weight: number;
}

interface ProjectRow {
  id: string;
  group_id: string;
  parent_id: string | null;
  name: string;
  position: number;
  due_date: string | null;
  start_date: string | null;
  completed_at: number | null;
  created_at: number;
  updated_at: number;
  storage_path: string | null;
  excalidraw_note_id: string | null;
  leader_user_id: string | null;
  progress_override: number | null;
}

interface ActivityRow {
  id: string;
  group_id: string;
  parent_project_id: string | null;
  actor_user_id: string;
  action: PmActivityAction;
  target_type: "parent" | "child" | "task";
  target_id: string | null;
  target_name: string;
  created_at: number;
  actor_display_name: string;
  actor_username: string;
  parent_name: string | null;
}

interface TaskRow {
  id: string;
  group_id: string;
  parent_project_id: string | null;
  child_project_id: string | null;
  title: string;
  description: string;
  due_date: string | null;
  status: string;
  assignee_id: string;
  created_by: string;
  completed_at: number | null;
  created_at: number;
  updated_at: number;
  parent_name: string | null;
  child_name: string | null;
  assignee_display_name: string;
  assignee_username: string;
  creator_display_name: string;
  creator_username: string;
}

interface AvailabilityRow {
  avail_date: string;
  status: PmAvailabilityStatus;
}

interface GroupAvailabilityRow {
  avail_date: string;
  user_id: string;
  display_name: string;
  username: string;
}

interface AssigneeRow {
  project_id: string;
  user_id: string;
  display_name: string;
  username: string;
}

/** アプリアクセス可能な所属のみ返す */
export async function getAccessibleMemberships(
  db: D1Database,
  userId: string
): Promise<UserGroupMembership[]> {
  const app = await getAppBySlug(db, PROJECT_APP_SLUG);
  if (!app) return [];

  const isHubAdmin = await userHasAdminRole(db, userId);
  const memberships = await getUserGroupMemberships(db, userId);
  const { enabledGroupIds, roleRestrictions } = await loadAppAccessMeta(
    db,
    app.id
  );

  if (isHubAdmin) {
    if (enabledGroupIds.size === 0) {
      return memberships;
    }
    return memberships.filter((m) => enabledGroupIds.has(m.group_id));
  }

  if (enabledGroupIds.size === 0) return [];

  return memberships.filter((m) =>
    membershipCanAccessApp(m, enabledGroupIds, roleRestrictions)
  );
}

/** グループへのアクセス可能な所属を取得 */
async function requireGroupMembership(
  db: D1Database,
  userId: string,
  groupId: string
): Promise<UserGroupMembership> {
  const memberships = await getAccessibleMemberships(db, userId);
  const membership = memberships.find((m) => m.group_id === groupId);
  if (!membership) {
    throw new Error("グループに所属していないか、アクセス権限がありません");
  }
  return membership;
}

/** グループの管理者資格の最低 weight を取得 */
export async function getMinEligibleWeight(
  db: D1Database,
  groupId: string
): Promise<number> {
  const row = await db
    .prepare(
      "SELECT group_id, min_eligible_weight FROM pm_admin_settings WHERE group_id = ?"
    )
    .bind(groupId)
    .first<AdminSettingsRow>();

  return row?.min_eligible_weight ?? 0;
}

/** グループ内メンバーの weight 一覧 */
async function listMemberWeights(
  db: D1Database,
  groupId: string
): Promise<MemberWeightRow[]> {
  const result = await db
    .prepare(
      `SELECT ugm.user_id AS user_id, gr.weight AS weight
       FROM user_group_memberships ugm
       JOIN group_roles gr ON gr.id = ugm.group_role_id
       WHERE ugm.group_id = ?`
    )
    .bind(groupId)
    .all<MemberWeightRow>();

  return result.results ?? [];
}

/**
 * グループ管理者か判定する。
 * 資格 weight 以上のメンバーのうち、最大 weight を持つユーザーが管理者。
 */
export async function resolveProjectAdmin(
  db: D1Database,
  userId: string,
  groupId: string,
  userWeight: number
): Promise<{ isAdmin: boolean; maxWeight: number; minEligibleWeight: number }> {
  const minEligibleWeight = await getMinEligibleWeight(db, groupId);
  const members = await listMemberWeights(db, groupId);
  const eligible = members.filter((m) => m.weight >= minEligibleWeight);

  if (eligible.length === 0) {
    return { isAdmin: false, maxWeight: 0, minEligibleWeight };
  }

  const maxWeight = Math.max(...eligible.map((m) => m.weight));
  const isAdmin =
    eligible.some((m) => m.user_id === userId) && userWeight === maxWeight;

  return { isAdmin, maxWeight, minEligibleWeight };
}

/** 現ユーザーがグループ管理者か */
async function assertGroupAdmin(
  db: D1Database,
  userId: string,
  membership: UserGroupMembership
): Promise<void> {
  const weight = membership.group_role_weight ?? 0;
  const admin = await resolveProjectAdmin(
    db,
    userId,
    membership.group_id,
    weight
  );
  if (!admin.isAdmin) {
    throw new Error("管理者権限がありません");
  }
}

/** グループのロール一覧 */
async function listGroupRoles(
  db: D1Database,
  groupId: string
): Promise<PmGroupRole[]> {
  const result = await db
    .prepare(
      `SELECT id, slug, display_name, color, weight
       FROM group_roles
       WHERE group_id = ?
       ORDER BY weight DESC, position ASC, display_name ASC`
    )
    .bind(groupId)
    .all<PmGroupRole>();

  return result.results ?? [];
}

/** タイムスタンプを JST 日付文字列に変換 */
function timestampToJstDate(ts: number): string {
  return new Date(ts).toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

/** 実効開始日（start_date 未設定なら作成日） */
function effectiveStartDate(row: ProjectRow): string {
  if (row.start_date && DATE_RE.test(row.start_date)) {
    return row.start_date;
  }
  return timestampToJstDate(row.created_at);
}

/** 納期の緊急度（達成済みは null） */
function dueUrgency(
  dueDate: string | null,
  isCompleted: boolean,
  today: string
): PmDueUrgency {
  if (isCompleted || !dueDate || !DATE_RE.test(dueDate)) return null;
  if (dueDate < today) return "overdue";
  const due = new Date(`${dueDate}T00:00:00+09:00`);
  const now = new Date(`${today}T00:00:00+09:00`);
  const diffDays = Math.ceil(
    (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays <= 7) return "warning";
  return "ok";
}

/** 子プロジェクト行を API 用オブジェクトに変換 */
async function toChildProject(
  db: D1Database,
  groupId: string,
  row: ProjectRow,
  assignees: PmAssignee[],
  today: string
): Promise<PmChildProject> {
  const isCompleted = row.completed_at != null;
  const start = effectiveStartDate(row);
  const isActive = !isCompleted && start <= today;
  const isPending = !isCompleted && start > today;
  const urgency = dueUrgency(row.due_date, isCompleted, today);

  // 工数: 開始日〜納期の活動可能日（開始前なら開始日〜納期、開始後なら今日〜納期）
  let effortFrom: string | null = null;
  if (row.due_date && DATE_RE.test(row.due_date)) {
    effortFrom = isActive ? today : start;
    if (effortFrom > row.due_date) effortFrom = row.due_date;
  }

  const effortDays =
    effortFrom && row.due_date
      ? await calculateEffortDaysBetween(
          db,
          groupId,
          assignees.map((a) => a.id),
          effortFrom,
          row.due_date
        )
      : null;

  return {
    id: row.id,
    name: row.name,
    position: row.position,
    start_date: row.start_date,
    effective_start_date: start,
    due_date: row.due_date,
    completed_at: row.completed_at,
    is_completed: isCompleted,
    is_active: isActive,
    is_pending: isPending,
    due_urgency: urgency,
    assignees,
    effort_days: effortDays,
    storage_path: row.storage_path ?? null,
    excalidraw_note_id: row.excalidraw_note_id ?? null,
  };
}

/** 所属からグループサマリーを組み立てる */
async function toGroupSummary(
  db: D1Database,
  userId: string,
  membership: UserGroupMembership
): Promise<PmGroupSummary> {
  const weight = membership.group_role_weight ?? 0;
  const admin = await resolveProjectAdmin(
    db,
    userId,
    membership.group_id,
    weight
  );

  return {
    id: membership.group_id,
    slug: membership.group_slug,
    display_name: membership.group_display_name,
    color: membership.group_color,
    my_role: {
      id: membership.group_role_id,
      slug: membership.group_role_slug,
      display_name: membership.group_role_display_name,
      color: membership.group_role_color,
      weight,
    },
    is_admin: admin.isAdmin,
    max_weight: admin.maxWeight,
    min_eligible_weight: admin.minEligibleWeight,
  };
}

/** JST の今日 (YYYY-MM-DD) */
function todayJst(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

/** グループのメンバー一覧（担当割当用） */
export async function listGroupMembers(
  db: D1Database,
  groupId: string
): Promise<PmMember[]> {
  const result = await db
    .prepare(
      `SELECT u.id, u.display_name, u.username
       FROM user_group_memberships ugm
       JOIN users u ON u.id = ugm.user_id
       WHERE ugm.group_id = ?
       ORDER BY u.display_name COLLATE NOCASE, u.username`
    )
    .bind(groupId)
    .all<{ id: string; display_name: string; username: string }>();

  return (result.results ?? []).map((u) => ({
    id: u.id,
    display_name: u.display_name || u.username,
    username: u.username,
  }));
}

/** 子プロジェクトの担当者一覧を取得 */
async function listAssigneesByProjects(
  db: D1Database,
  projectIds: string[]
): Promise<Map<string, PmAssignee[]>> {
  const map = new Map<string, PmAssignee[]>();
  if (projectIds.length === 0) return map;

  const placeholders = projectIds.map(() => "?").join(", ");
  const result = await db
    .prepare(
      `SELECT a.project_id, u.id AS user_id, u.display_name, u.username
       FROM pm_project_assignees a
       JOIN users u ON u.id = a.user_id
       WHERE a.project_id IN (${placeholders})
       ORDER BY u.display_name COLLATE NOCASE, u.username`
    )
    .bind(...projectIds)
    .all<AssigneeRow>();

  for (const row of result.results ?? []) {
    const list = map.get(row.project_id) ?? [];
    list.push({
      id: row.user_id,
      display_name: row.display_name || row.username,
      username: row.username,
    });
    map.set(row.project_id, list);
  }
  return map;
}

/** 親プロジェクトのリーダー一覧を取得 */
async function listLeadersByProjects(
  db: D1Database,
  projectIds: string[]
): Promise<Map<string, PmAssignee[]>> {
  const map = new Map<string, PmAssignee[]>();
  if (projectIds.length === 0) return map;

  const placeholders = projectIds.map(() => "?").join(", ");
  const result = await db
    .prepare(
      `SELECT l.project_id, u.id AS user_id, u.display_name, u.username
       FROM pm_project_leaders l
       JOIN users u ON u.id = l.user_id
       WHERE l.project_id IN (${placeholders})
       ORDER BY u.display_name COLLATE NOCASE, u.username`
    )
    .bind(...projectIds)
    .all<AssigneeRow>();

  for (const row of result.results ?? []) {
    const list = map.get(row.project_id) ?? [];
    list.push({
      id: row.user_id,
      display_name: row.display_name || row.username,
      username: row.username,
    });
    map.set(row.project_id, list);
  }
  return map;
}

/** 親プロジェクトの担当者一覧 */
async function listParentMembersByProjects(
  db: D1Database,
  parentProjectIds: string[]
): Promise<Map<string, PmAssignee[]>> {
  const map = new Map<string, PmAssignee[]>();
  if (parentProjectIds.length === 0) return map;

  const placeholders = parentProjectIds.map(() => "?").join(", ");
  const result = await db
    .prepare(
      `SELECT m.parent_project_id, u.id AS user_id, u.display_name, u.username
       FROM pm_parent_members m
       JOIN users u ON u.id = m.user_id
       WHERE m.parent_project_id IN (${placeholders})
       ORDER BY u.display_name COLLATE NOCASE, u.username`
    )
    .bind(...parentProjectIds)
    .all<{ parent_project_id: string; user_id: string; display_name: string; username: string }>();

  for (const row of result.results ?? []) {
    const list = map.get(row.parent_project_id) ?? [];
    list.push({
      id: row.user_id,
      display_name: row.display_name || row.username,
      username: row.username,
    });
    map.set(row.parent_project_id, list);
  }
  return map;
}

/** 親プロジェクトのリーダー ID 集合 */
async function listParentLeaderIds(
  db: D1Database,
  parentProjectId: string
): Promise<Set<string>> {
  const result = await db
    .prepare(
      `SELECT user_id FROM pm_project_leaders WHERE project_id = ?`
    )
    .bind(parentProjectId)
    .all<{ user_id: string }>();
  return new Set((result.results ?? []).map((r) => r.user_id));
}

/** 子一覧から進捗率と最遅納期を算出 */
function parentProgressStats(kids: PmChildProject[]): {
  progress_percent: number;
  child_total: number;
  child_completed: number;
  latest_due_date: string | null;
} {
  const childTotal = kids.length;
  const childCompleted = kids.filter((c) => c.is_completed).length;
  const progressPercent =
    childTotal === 0 ? 0 : Math.round((childCompleted / childTotal) * 100);
  const dueDates = kids
    .map((c) => c.due_date)
    .filter((d): d is string => Boolean(d && DATE_RE.test(d)))
    .sort();
  const latestDue = dueDates.length > 0 ? dueDates[dueDates.length - 1]! : null;
  return {
    progress_percent: progressPercent,
    child_total: childTotal,
    child_completed: childCompleted,
    latest_due_date: latestDue,
  };
}

/** アクティビティを記録 */
async function recordActivity(
  db: D1Database,
  input: {
    group_id: string;
    parent_project_id?: string | null;
    actor_user_id: string;
    action: PmActivityAction;
    target_type: "parent" | "child" | "task";
    target_id?: string | null;
    target_name: string;
  }
): Promise<void> {
  const timestamp = now();
  await db
    .prepare(
      `INSERT INTO pm_activity
         (id, group_id, parent_project_id, actor_user_id, action,
          target_type, target_id, target_name, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      createId("pmact"),
      input.group_id,
      input.parent_project_id ?? null,
      input.actor_user_id,
      input.action,
      input.target_type,
      input.target_id ?? null,
      input.target_name,
      timestamp
    )
    .run();
}

/** ActivityRow を PmActivity に変換 */
function toPmActivity(row: ActivityRow): PmActivity {
  return {
    id: row.id,
    group_id: row.group_id,
    parent_project_id: row.parent_project_id,
    parent_name: row.parent_name,
    actor: {
      id: row.actor_user_id,
      display_name: row.actor_display_name || row.actor_username,
      username: row.actor_username,
    },
    action: row.action,
    target_type: row.target_type,
    target_id: row.target_id,
    target_name: row.target_name,
    created_at: row.created_at,
  };
}

/** グループの直近アクティビティ */
export async function listRecentActivity(
  db: D1Database,
  groupId: string,
  limit = 30
): Promise<PmActivity[]> {
  const result = await db
    .prepare(
      `SELECT a.id, a.group_id, a.parent_project_id, a.actor_user_id,
              a.action, a.target_type, a.target_id, a.target_name, a.created_at,
              u.display_name AS actor_display_name, u.username AS actor_username,
              p.name AS parent_name
       FROM pm_activity a
       JOIN users u ON u.id = a.actor_user_id
       LEFT JOIN pm_projects p ON p.id = a.parent_project_id
       WHERE a.group_id = ?
       ORDER BY a.created_at DESC
       LIMIT ?`
    )
    .bind(groupId, limit)
    .all<ActivityRow>();

  return (result.results ?? []).map(toPmActivity);
}

/** TaskRow を PmTask に変換 */
function toPmTask(row: TaskRow, today: string): PmTask {
  const isCompleted = row.completed_at != null;
  const status: PmTaskStatus = row.status === "active" ? "active" : "pending";
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    parent_project_id: row.parent_project_id,
    parent_name: row.parent_name,
    child_project_id: row.child_project_id,
    child_name: row.child_name,
    due_date: row.due_date,
    status,
    is_active: !isCompleted && status === "active",
    is_pending: !isCompleted && status === "pending",
    assignee: {
      id: row.assignee_id,
      display_name: row.assignee_display_name || row.assignee_username,
      username: row.assignee_username,
    },
    created_by: {
      id: row.created_by,
      display_name: row.creator_display_name || row.creator_username,
      username: row.creator_username,
    },
    is_completed: isCompleted,
    completed_at: row.completed_at,
    due_urgency: dueUrgency(row.due_date, isCompleted, today),
    created_at: row.created_at,
  };
}

const TASK_SELECT_SQL = `SELECT t.id, t.group_id, t.parent_project_id, t.child_project_id,
              t.title, t.description, t.due_date, t.status, t.assignee_id, t.created_by,
              t.completed_at, t.created_at, t.updated_at,
              p.name AS parent_name,
              c.name AS child_name,
              ua.display_name AS assignee_display_name,
              ua.username AS assignee_username,
              uc.display_name AS creator_display_name,
              uc.username AS creator_username
       FROM pm_tasks t
       LEFT JOIN pm_projects p ON p.id = t.parent_project_id
       LEFT JOIN pm_projects c ON c.id = t.child_project_id
       JOIN users ua ON ua.id = t.assignee_id
       JOIN users uc ON uc.id = t.created_by`;

/** 現ユーザーに振られた未完了タスク一覧 */
export async function listMyOpenTasks(
  db: D1Database,
  groupId: string,
  userId: string
): Promise<PmTask[]> {
  const today = todayJst();
  const result = await db
    .prepare(
      `${TASK_SELECT_SQL}
       WHERE t.group_id = ? AND t.assignee_id = ? AND t.completed_at IS NULL
       ORDER BY
         CASE WHEN t.due_date IS NULL THEN 1 ELSE 0 END,
         t.due_date ASC,
         t.created_at DESC`
    )
    .bind(groupId, userId)
    .all<TaskRow>();

  return (result.results ?? []).map((row) => toPmTask(row, today));
}

const MY_COMPLETED_TASKS_LIMIT = 50;

/** 現ユーザーに振られた達成済みタスク一覧（直近） */
export async function listMyCompletedTasks(
  db: D1Database,
  groupId: string,
  userId: string,
  limit = MY_COMPLETED_TASKS_LIMIT
): Promise<PmTask[]> {
  const today = todayJst();
  const result = await db
    .prepare(
      `${TASK_SELECT_SQL}
       WHERE t.group_id = ? AND t.assignee_id = ? AND t.completed_at IS NOT NULL
       ORDER BY t.completed_at DESC, t.created_at DESC
       LIMIT ?`
    )
    .bind(groupId, userId, limit)
    .all<TaskRow>();

  return (result.results ?? []).map((row) => toPmTask(row, today));
}

/** グループ内の未完了タスク一覧（メンバー一覧用） */
export async function listGroupOpenTasks(
  db: D1Database,
  groupId: string
): Promise<PmTask[]> {
  const today = todayJst();
  const result = await db
    .prepare(
      `${TASK_SELECT_SQL}
       WHERE t.group_id = ? AND t.completed_at IS NULL
       ORDER BY
         t.assignee_id,
         CASE t.status WHEN 'active' THEN 0 ELSE 1 END,
         CASE WHEN t.due_date IS NULL THEN 1 ELSE 0 END,
         t.due_date ASC,
         t.created_at DESC`
    )
    .bind(groupId)
    .all<TaskRow>();

  return (result.results ?? []).map((row) => toPmTask(row, today));
}

/** メンバー別タスクボードを組み立てる */
export async function buildMemberBoard(
  db: D1Database,
  groupId: string,
  userId: string
): Promise<PmMemberBoard[]> {
  const members = await listGroupMembers(db, groupId);
  const tasks = await listGroupOpenTasks(db, groupId);
  const membership = await requireGroupMembership(db, userId, groupId);
  const admin = await resolveProjectAdmin(
    db,
    userId,
    groupId,
    membership.group_role_weight ?? 0
  );

  return members.map((member) => {
    const mine = tasks.filter((t) => t.assignee.id === member.id);
    return {
      member,
      active_tasks: mine.filter((t) => t.status === "active"),
      pending_tasks: mine.filter((t) => t.status === "pending"),
      can_add: member.id === userId || admin.isAdmin,
    };
  });
}

/** タスク操作後のダッシュボードスライス */
async function taskMutationResult(
  db: D1Database,
  groupId: string,
  userId: string
): Promise<{
  projects: PmParentProject[];
  tasks: PmTask[];
  completed_tasks: PmTask[];
  member_board: PmMemberBoard[];
}> {
  const [projects, tasks, completed_tasks, member_board] = await Promise.all([
    listProjects(db, groupId, userId),
    listMyOpenTasks(db, groupId, userId),
    listMyCompletedTasks(db, groupId, userId),
    buildMemberBoard(db, groupId, userId),
  ]);
  return { projects, tasks, completed_tasks, member_board };
}

/** 担当者がグループメンバーか確認 */
async function assertAssigneeInGroup(
  db: D1Database,
  groupId: string,
  assigneeId: string
): Promise<void> {
  const row = await db
    .prepare(
      `SELECT 1 AS ok FROM user_group_memberships
       WHERE group_id = ? AND user_id = ?`
    )
    .bind(groupId, assigneeId)
    .first<{ ok: number }>();
  if (!row) {
    throw new Error("担当者がグループメンバーではありません");
  }
}

/** タスクの管理権限（担当者または管理者） */
async function assertCanManageTask(
  db: D1Database,
  userId: string,
  task: { group_id: string; assignee_id: string }
): Promise<void> {
  const membership = await requireGroupMembership(db, userId, task.group_id);
  if (task.assignee_id === userId) return;
  const admin = await resolveProjectAdmin(
    db,
    userId,
    task.group_id,
    membership.group_role_weight ?? 0
  );
  if (!admin.isAdmin) {
    throw new Error("このタスクを操作する権限がありません");
  }
}

function parseTaskStatus(value: unknown): PmTaskStatus {
  return value === "active" ? "active" : "pending";
}

/**
 * 担当者の from〜to の活動可能日数合計を計算する。
 * 未設定日は活動不可扱いのため、status='available' のみカウント。
 */
export async function calculateEffortDaysBetween(
  db: D1Database,
  groupId: string,
  assigneeIds: string[],
  from: string,
  to: string
): Promise<number | null> {
  if (!DATE_RE.test(from) || !DATE_RE.test(to)) return null;
  if (assigneeIds.length === 0) return 0;
  if (to < from) return 0;

  const placeholders = assigneeIds.map(() => "?").join(", ");
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS cnt
       FROM pm_availability
       WHERE group_id = ?
         AND user_id IN (${placeholders})
         AND status = 'available'
         AND avail_date >= ?
         AND avail_date <= ?`
    )
    .bind(groupId, ...assigneeIds, from, to)
    .first<{ cnt: number }>();

  return row?.cnt ?? 0;
}

/** 今日〜納期の工数（互換） */
export async function calculateEffortDays(
  db: D1Database,
  groupId: string,
  assigneeIds: string[],
  dueDate: string | null
): Promise<number | null> {
  if (!dueDate || !DATE_RE.test(dueDate)) return null;
  return calculateEffortDaysBetween(
    db,
    groupId,
    assigneeIds,
    todayJst(),
    dueDate
  );
}

/** 納期変更時の工数プレビュー */
export async function previewEffort(
  db: D1Database,
  userId: string,
  projectId: string,
  dueDate: string | null,
  startDate?: string | null
): Promise<{
  due_date: string | null;
  start_date: string | null;
  effective_start_date: string;
  effort_days: number | null;
  assignees: PmAssignee[];
}> {
  const project = await db
    .prepare(
      `SELECT id, group_id, parent_id, name, position, due_date, start_date, completed_at, created_at, storage_path, leader_user_id
       FROM pm_projects WHERE id = ?`
    )
    .bind(projectId)
    .first<ProjectRow>();

  if (!project) {
    throw new Error("プロジェクトが見つかりません");
  }
  if (!project.parent_id) {
    throw new Error("子プロジェクトのみ納期を設定できます");
  }

  await requireGroupMembership(db, userId, project.group_id);

  const normalizedDue =
    dueDate && dueDate.trim() && DATE_RE.test(dueDate.trim())
      ? dueDate.trim()
      : null;
  if (dueDate && dueDate.trim() && !normalizedDue) {
    throw new Error("納期の形式が不正です");
  }

  let previewStart = project.start_date;
  if (startDate !== undefined) {
    previewStart =
      startDate && startDate.trim() && DATE_RE.test(startDate.trim())
        ? startDate.trim()
        : null;
    if (startDate && startDate.trim() && !previewStart) {
      throw new Error("開始予定日の形式が不正です");
    }
  }

  const effective = previewStart ?? timestampToJstDate(project.created_at);
  const today = todayJst();
  const assigneeMap = await listAssigneesByProjects(db, [projectId]);
  const assignees = assigneeMap.get(projectId) ?? [];

  let effortDays: number | null = null;
  if (normalizedDue) {
    const from = effective <= today ? today : effective;
    const effortFrom = from > normalizedDue ? normalizedDue : from;
    effortDays = await calculateEffortDaysBetween(
      db,
      project.group_id,
      assignees.map((a) => a.id),
      effortFrom,
      normalizedDue
    );
  }

  return {
    due_date: normalizedDue,
    start_date: previewStart,
    effective_start_date: effective,
    effort_days: effortDays,
    assignees,
  };
}

/** グループの親子プロジェクト一覧 */
export async function listProjects(
  db: D1Database,
  groupId: string,
  currentUserId?: string
): Promise<PmParentProject[]> {
  const result = await db
    .prepare(
      `SELECT id, group_id, parent_id, name, position, due_date, start_date, completed_at, created_at, updated_at, storage_path, excalidraw_note_id, leader_user_id, progress_override
       FROM pm_projects
       WHERE group_id = ?
       ORDER BY position ASC, created_at ASC`
    )
    .bind(groupId)
    .all<ProjectRow>();

  const rows = result.results ?? [];
  const parents = rows.filter((r) => !r.parent_id);
  const children = rows.filter((r) => r.parent_id);
  const childIds = children.map((c) => c.id);
  const assigneeMap = await listAssigneesByProjects(db, childIds);
  const leaderMap = await listLeadersByProjects(
    db,
    parents.map((p) => p.id)
  );
  const parentMemberMap = await listParentMembersByProjects(
    db,
    parents.map((p) => p.id)
  );
  const today = todayJst();

  const childById = new Map<string, PmChildProject>();
  for (const c of children) {
    const assignees = assigneeMap.get(c.id) ?? [];
    childById.set(
      c.id,
      await toChildProject(db, groupId, c, assignees, today)
    );
  }

  return parents.map((parent) => {
    const siblingChildren = children.filter((c) => c.parent_id === parent.id);
    const kids = siblingChildren
      .map((c) => childById.get(c.id)!)
      .filter(Boolean);
    const members = parentMemberMap.get(parent.id) ?? [];
    const leaders = leaderMap.get(parent.id) ?? [];
    const stats = parentProgressStats(kids);
    const override = parent.progress_override;
    const progressManual =
      override != null &&
      Number.isFinite(override) &&
      override >= 0 &&
      override <= 100;
    const progressPercent = progressManual
      ? Math.round(Number(override))
      : stats.progress_percent;

    return {
      id: parent.id,
      name: parent.name,
      position: parent.position,
      leader: leaders[0] ?? null,
      leaders,
      members,
      is_leader: Boolean(
        currentUserId && leaders.some((l) => l.id === currentUserId)
      ),
      children: kids.filter((c) => !c.is_completed),
      completed_children: kids.filter((c) => c.is_completed),
      progress_percent: progressPercent,
      progress_manual: progressManual,
      child_total: stats.child_total,
      child_completed: stats.child_completed,
      updated_at: parent.updated_at ?? parent.created_at,
      latest_due_date: stats.latest_due_date,
      excalidraw_note_id: parent.excalidraw_note_id ?? null,
    };
  });
}

/** 親または子プロジェクトを作成（管理者のみ） */
export async function createProject(
  db: D1Database,
  userId: string,
  input: { group_id: string; name: string; parent_id?: string | null }
): Promise<PmParentProject[]> {
  const name = input.name.trim();
  if (!name) {
    throw new Error("プロジェクト名を入力してください");
  }
  if (name.length > 80) {
    throw new Error("プロジェクト名は80文字以内にしてください");
  }

  const membership = await requireGroupMembership(
    db,
    userId,
    input.group_id
  );
  await assertGroupAdmin(db, userId, membership);

  let parentId: string | null = null;
  if (input.parent_id) {
    const parent = await db
      .prepare(
        `SELECT id, group_id, parent_id FROM pm_projects
         WHERE id = ? AND group_id = ?`
      )
      .bind(input.parent_id, input.group_id)
      .first<ProjectRow>();

    if (!parent) {
      throw new Error("親プロジェクトが見つかりません");
    }
    if (parent.parent_id) {
      throw new Error("子プロジェクトの下には作成できません");
    }
    parentId = parent.id;
  }

  const posRow = await db
    .prepare(
      `SELECT COALESCE(MAX(position), -1) AS max_pos
       FROM pm_projects
       WHERE group_id = ? AND ${parentId ? "parent_id = ?" : "parent_id IS NULL"}`
    )
    .bind(...(parentId ? [input.group_id, parentId] : [input.group_id]))
    .first<{ max_pos: number }>();

  const position = (posRow?.max_pos ?? -1) + 1;
  const timestamp = now();
  const id = createId("pmproj");

  await db
    .prepare(
      `INSERT INTO pm_projects
         (id, group_id, parent_id, name, position, due_date, start_date, completed_at, storage_path, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NULL, NULL, NULL, NULL, ?, ?, ?)`
    )
    .bind(
      id,
      input.group_id,
      parentId,
      name,
      position,
      userId,
      timestamp,
      timestamp
    )
    .run();

  await recordActivity(db, {
    group_id: input.group_id,
    parent_project_id: parentId,
    actor_user_id: userId,
    action: parentId ? "created_child" : "created_parent",
    target_type: parentId ? "child" : "parent",
    target_id: id,
    target_name: name,
  });

  return listProjects(db, input.group_id, userId);
}

/** プロジェクトを削除（管理者のみ・子も CASCADE） */
export async function deleteProject(
  db: D1Database,
  userId: string,
  projectId: string
): Promise<PmParentProject[]> {
  const project = await db
    .prepare(
      `SELECT id, group_id, parent_id, name, position, due_date, start_date, completed_at, created_at, storage_path, leader_user_id
       FROM pm_projects WHERE id = ?`
    )
    .bind(projectId)
    .first<ProjectRow>();

  if (!project) {
    throw new Error("プロジェクトが見つかりません");
  }

  const membership = await requireGroupMembership(
    db,
    userId,
    project.group_id
  );
  await assertGroupAdmin(db, userId, membership);

  await recordActivity(db, {
    group_id: project.group_id,
    parent_project_id: project.parent_id ?? project.id,
    actor_user_id: userId,
    action: "deleted_project",
    target_type: project.parent_id ? "child" : "parent",
    target_id: projectId,
    target_name: project.name,
  });

  await db
    .prepare("DELETE FROM pm_projects WHERE id = ?")
    .bind(projectId)
    .run();

  return listProjects(db, project.group_id, userId);
}

/**
 * 子プロジェクトの開始予定日・納期を更新。
 * グループメンバーなら誰でも編集可（担当外も可）。
 */
export async function updateChildSchedule(
  db: D1Database,
  userId: string,
  projectId: string,
  input: { due_date?: string | null; start_date?: string | null }
): Promise<PmParentProject[]> {
  const project = await db
    .prepare(
      `SELECT id, group_id, parent_id, name, position, due_date, start_date, completed_at, created_at, storage_path, leader_user_id
       FROM pm_projects WHERE id = ?`
    )
    .bind(projectId)
    .first<ProjectRow>();

  if (!project) {
    throw new Error("プロジェクトが見つかりません");
  }
  if (!project.parent_id) {
    throw new Error("子プロジェクトのみスケジュールを設定できます");
  }

  await requireGroupMembership(db, userId, project.group_id);

  const updates: string[] = [];
  const values: (string | number | null)[] = [];

  if (input.due_date !== undefined) {
    const normalized =
      input.due_date && input.due_date.trim() ? input.due_date.trim() : null;
    if (normalized && !DATE_RE.test(normalized)) {
      throw new Error("納期の形式が不正です");
    }
    updates.push("due_date = ?");
    values.push(normalized);
  }

  if (input.start_date !== undefined) {
    const normalized =
      input.start_date && input.start_date.trim()
        ? input.start_date.trim()
        : null;
    if (normalized && !DATE_RE.test(normalized)) {
      throw new Error("開始予定日の形式が不正です");
    }
    updates.push("start_date = ?");
    values.push(normalized);
  }

  if (updates.length === 0) {
    throw new Error("due_date または start_date を指定してください");
  }

  const timestamp = now();
  updates.push("updated_at = ?");
  values.push(timestamp);
  values.push(projectId);

  await db
    .prepare(`UPDATE pm_projects SET ${updates.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();

  return listProjects(db, project.group_id, userId);
}

/** @deprecated updateChildSchedule を使用 */
export async function updateChildDueDate(
  db: D1Database,
  userId: string,
  projectId: string,
  dueDate: string | null
): Promise<PmParentProject[]> {
  return updateChildSchedule(db, userId, projectId, { due_date: dueDate });
}

/**
 * 子プロジェクトを達成済み／未達成に切り替え（管理者のみ）。
 */
export async function setChildCompleted(
  db: D1Database,
  userId: string,
  projectId: string,
  completed: boolean
): Promise<PmParentProject[]> {
  const project = await db
    .prepare(
      `SELECT id, group_id, parent_id, name, position, due_date, start_date, completed_at, created_at, storage_path, leader_user_id
       FROM pm_projects WHERE id = ?`
    )
    .bind(projectId)
    .first<ProjectRow>();

  if (!project) {
    throw new Error("プロジェクトが見つかりません");
  }
  if (!project.parent_id) {
    throw new Error("子プロジェクトのみ達成済みにできます");
  }

  const membership = await requireGroupMembership(
    db,
    userId,
    project.group_id
  );
  await assertGroupAdmin(db, userId, membership);

  const timestamp = now();
  await db
    .prepare(
      `UPDATE pm_projects SET completed_at = ?, updated_at = ? WHERE id = ?`
    )
    .bind(completed ? timestamp : null, timestamp, projectId)
    .run();

  await recordActivity(db, {
    group_id: project.group_id,
    parent_project_id: project.parent_id,
    actor_user_id: userId,
    action: completed ? "completed_child" : "reopened_child",
    target_type: "child",
    target_id: projectId,
    target_name: project.name,
  });

  return listProjects(db, project.group_id, userId);
}

/**
 * 子プロジェクトにグループストレージのディレクトリを紐づける（管理者のみ）。
 * path は論理パス（例: g/{groupSlug}/docs）。null で解除。
 */
export async function setChildStoragePath(
  db: D1Database,
  userId: string,
  projectId: string,
  storagePath: string | null
): Promise<PmParentProject[]> {
  const project = await db
    .prepare(
      `SELECT id, group_id, parent_id, name, position, due_date, start_date, completed_at, created_at, storage_path, leader_user_id
       FROM pm_projects WHERE id = ?`
    )
    .bind(projectId)
    .first<ProjectRow>();

  if (!project) {
    throw new Error("プロジェクトが見つかりません");
  }
  if (!project.parent_id) {
    throw new Error("子プロジェクトのみストレージを紐づけできます");
  }

  const membership = await requireGroupMembership(
    db,
    userId,
    project.group_id
  );
  await assertGroupAdmin(db, userId, membership);

  const group = await db
    .prepare("SELECT slug FROM hub_groups WHERE id = ?")
    .bind(project.group_id)
    .first<{ slug: string }>();

  if (!group?.slug) {
    throw new Error("グループが見つかりません");
  }

  let normalized: string | null = null;
  if (storagePath && storagePath.trim()) {
    normalized = storagePath.trim().replace(/^\/+|\/+$/g, "");
    const prefix = `g/${group.slug}`;
    if (normalized !== prefix && !normalized.startsWith(`${prefix}/`)) {
      throw new Error(
        "このグループのクラウドストレージ内のディレクトリのみ指定できます"
      );
    }
  }

  const timestamp = now();
  await db
    .prepare(
      `UPDATE pm_projects SET storage_path = ?, updated_at = ? WHERE id = ?`
    )
    .bind(normalized, timestamp, projectId)
    .run();

  return listProjects(db, project.group_id, userId);
}

/**
 * グループのストレージルート論理パスを返す。
 */
export async function getGroupStorageRootPath(
  db: D1Database,
  groupId: string
): Promise<string> {
  const group = await db
    .prepare("SELECT slug FROM hub_groups WHERE id = ?")
    .bind(groupId)
    .first<{ slug: string }>();
  if (!group?.slug) {
    throw new Error("グループが見つかりません");
  }
  return `g/${group.slug}`;
}

/**
 * 子プロジェクトの担当メンバーを設定（管理者のみ）。
 * グループメンバー以外は指定不可。
 */
export async function setChildAssignees(
  db: D1Database,
  userId: string,
  projectId: string,
  assigneeIds: string[]
): Promise<PmParentProject[]> {
  const project = await db
    .prepare(
      `SELECT id, group_id, parent_id, name, position, due_date, start_date, completed_at, created_at, storage_path, leader_user_id
       FROM pm_projects WHERE id = ?`
    )
    .bind(projectId)
    .first<ProjectRow>();

  if (!project) {
    throw new Error("プロジェクトが見つかりません");
  }
  if (!project.parent_id) {
    throw new Error("子プロジェクトのみ担当を設定できます");
  }

  const membership = await requireGroupMembership(
    db,
    userId,
    project.group_id
  );
  await assertGroupAdmin(db, userId, membership);

  const uniqueIds = [...new Set(assigneeIds.filter(Boolean))];
  if (uniqueIds.length > 0) {
    const members = await listGroupMembers(db, project.group_id);
    const memberIds = new Set(members.map((m) => m.id));
    for (const id of uniqueIds) {
      if (!memberIds.has(id)) {
        throw new Error("グループ外のユーザーは担当に指定できません");
      }
    }
  }

  const timestamp = now();
  await db
    .prepare("DELETE FROM pm_project_assignees WHERE project_id = ?")
    .bind(projectId)
    .run();

  for (const assigneeId of uniqueIds) {
    await db
      .prepare(
        `INSERT INTO pm_project_assignees (project_id, user_id, assigned_at)
         VALUES (?, ?, ?)`
      )
      .bind(projectId, assigneeId, timestamp)
      .run();
  }

  await db
    .prepare(`UPDATE pm_projects SET updated_at = ? WHERE id = ?`)
    .bind(timestamp, projectId)
    .run();

  return listProjects(db, project.group_id, userId);
}

/**
 * 親プロジェクトの進捗率を手動設定（管理者のみ）。
 * progressPercent が null の場合は自動算出に戻す。
 */
export async function setParentProgress(
  db: D1Database,
  userId: string,
  parentProjectId: string,
  progressPercent: number | null
): Promise<PmParentProject[]> {
  const project = await db
    .prepare(
      `SELECT id, group_id, parent_id, name, position, due_date, start_date, completed_at, created_at, storage_path, leader_user_id, progress_override
       FROM pm_projects WHERE id = ?`
    )
    .bind(parentProjectId)
    .first<ProjectRow>();

  if (!project) {
    throw new Error("プロジェクトが見つかりません");
  }
  if (project.parent_id) {
    throw new Error("親プロジェクトのみ進捗を設定できます");
  }

  const membership = await requireGroupMembership(
    db,
    userId,
    project.group_id
  );
  await assertGroupAdmin(db, userId, membership);

  let override: number | null = null;
  if (progressPercent != null) {
    if (
      !Number.isFinite(progressPercent) ||
      progressPercent < 0 ||
      progressPercent > 100
    ) {
      throw new Error("進捗率は 0〜100 の数値で指定してください");
    }
    override = Math.round(progressPercent);
  }

  const timestamp = now();
  await db
    .prepare(
      `UPDATE pm_projects SET progress_override = ?, updated_at = ? WHERE id = ?`
    )
    .bind(override, timestamp, parentProjectId)
    .run();

  return listProjects(db, project.group_id, userId);
}

/**
 * 親プロジェクトのリーダーを設定（管理者のみ）。
 * leaderUserIds が空配列の場合は全員解除。グループメンバーのみ指定可。
 */
export async function setParentLeaders(
  db: D1Database,
  userId: string,
  parentProjectId: string,
  leaderUserIds: string[]
): Promise<PmParentProject[]> {
  const project = await db
    .prepare(
      `SELECT id, group_id, parent_id, name, position, due_date, start_date, completed_at, created_at, storage_path, leader_user_id
       FROM pm_projects WHERE id = ?`
    )
    .bind(parentProjectId)
    .first<ProjectRow>();

  if (!project) {
    throw new Error("プロジェクトが見つかりません");
  }
  if (project.parent_id) {
    throw new Error("親プロジェクトのみリーダーを設定できます");
  }

  const membership = await requireGroupMembership(
    db,
    userId,
    project.group_id
  );
  await assertGroupAdmin(db, userId, membership);

  const uniqueIds = [
    ...new Set(
      leaderUserIds
        .map((id) => String(id ?? "").trim())
        .filter(Boolean)
    ),
  ];

  if (uniqueIds.length > 0) {
    const members = await listGroupMembers(db, project.group_id);
    const memberSet = new Set(members.map((m) => m.id));
    for (const id of uniqueIds) {
      if (!memberSet.has(id)) {
        throw new Error("グループ外のユーザーはリーダーに指定できません");
      }
    }
  }

  const timestamp = now();
  await db
    .prepare(`DELETE FROM pm_project_leaders WHERE project_id = ?`)
    .bind(parentProjectId)
    .run();

  for (const leaderId of uniqueIds) {
    await db
      .prepare(
        `INSERT INTO pm_project_leaders (project_id, user_id) VALUES (?, ?)`
      )
      .bind(parentProjectId, leaderId)
      .run();
  }

  // 互換: 先頭を旧カラムにも反映
  await db
    .prepare(
      `UPDATE pm_projects SET leader_user_id = ?, updated_at = ? WHERE id = ?`
    )
    .bind(uniqueIds[0] ?? null, timestamp, parentProjectId)
    .run();

  return listProjects(db, project.group_id, userId);
}

/**
 * @deprecated setParentLeaders を使用
 */
export async function setParentLeader(
  db: D1Database,
  userId: string,
  parentProjectId: string,
  leaderUserId: string | null
): Promise<PmParentProject[]> {
  return setParentLeaders(
    db,
    userId,
    parentProjectId,
    leaderUserId ? [leaderUserId] : []
  );
}

/**
 * 親プロジェクトの担当者 ID 集合を取得（タスク発行対象）。
 */
async function listParentMemberIds(
  db: D1Database,
  parentProjectId: string
): Promise<Set<string>> {
  const result = await db
    .prepare(
      `SELECT user_id FROM pm_parent_members WHERE parent_project_id = ?`
    )
    .bind(parentProjectId)
    .all<{ user_id: string }>();

  return new Set((result.results ?? []).map((r) => r.user_id));
}

/**
 * 親プロジェクトの担当者を設定（リーダーのみ）。
 * memberUserIds が空配列の場合は全員解除。グループメンバーのみ指定可。
 */
export async function setParentMembers(
  db: D1Database,
  userId: string,
  parentProjectId: string,
  memberUserIds: string[]
): Promise<PmParentProject[]> {
  const project = await db
    .prepare(
      `SELECT id, group_id, parent_id, name, position, due_date, start_date, completed_at, created_at, storage_path, leader_user_id
       FROM pm_projects WHERE id = ?`
    )
    .bind(parentProjectId)
    .first<ProjectRow>();

  if (!project) {
    throw new Error("プロジェクトが見つかりません");
  }
  if (project.parent_id) {
    throw new Error("親プロジェクトのみ担当者を設定できます");
  }

  await requireGroupMembership(db, userId, project.group_id);
  const leaderIds = await listParentLeaderIds(db, parentProjectId);
  if (!leaderIds.has(userId)) {
    throw new Error("親プロジェクトのリーダーのみ担当者を設定できます");
  }

  const uniqueIds = [
    ...new Set(
      memberUserIds
        .map((id) => String(id ?? "").trim())
        .filter(Boolean)
    ),
  ];

  if (uniqueIds.length > 0) {
    const members = await listGroupMembers(db, project.group_id);
    const memberSet = new Set(members.map((m) => m.id));
    for (const id of uniqueIds) {
      if (!memberSet.has(id)) {
        throw new Error("グループ外のユーザーは担当者に指定できません");
      }
    }
  }

  const timestamp = now();
  await db
    .prepare(`DELETE FROM pm_parent_members WHERE parent_project_id = ?`)
    .bind(parentProjectId)
    .run();

  for (const memberId of uniqueIds) {
    await db
      .prepare(
        `INSERT INTO pm_parent_members (parent_project_id, user_id, assigned_at)
         VALUES (?, ?, ?)`
      )
      .bind(parentProjectId, memberId, timestamp)
      .run();
  }

  return listProjects(db, project.group_id, userId);
}

/**
 * タスクを作成する。
 * 自分への追加、管理者による他メンバーへの追加、リーダーによる親メンバーへの発行が可能。
 */
export async function createTask(
  db: D1Database,
  userId: string,
  input: {
    group_id?: string;
    parent_project_id?: string | null;
    child_project_id?: string | null;
    title: string;
    description?: string;
    due_date?: string | null;
    status?: PmTaskStatus;
    assignee_id?: string;
    assignee_ids?: string[];
  }
): Promise<{
  projects: PmParentProject[];
  tasks: PmTask[];
  completed_tasks: PmTask[];
  member_board: PmMemberBoard[];
}> {
  const title = input.title.trim();
  if (!title) {
    throw new Error("タスクの内容を入力してください");
  }
  if (title.length > 200) {
    throw new Error("タスクの内容は200文字以内にしてください");
  }

  const description = (input.description ?? "").trim();
  if (description.length > 2000) {
    throw new Error("詳細は2000文字以内にしてください");
  }

  let dueDate: string | null = null;
  if (input.due_date != null && String(input.due_date).trim()) {
    dueDate = String(input.due_date).trim();
    if (!DATE_RE.test(dueDate)) {
      throw new Error("納期の形式が不正です");
    }
  }

  const status = parseTaskStatus(input.status);
  let parentProjectId = input.parent_project_id?.trim() || null;
  let childProjectId = input.child_project_id?.trim() || null;
  let groupId = input.group_id?.trim() || "";

  if (childProjectId) {
    const child = await db
      .prepare(
        `SELECT id, group_id, parent_id, name FROM pm_projects WHERE id = ?`
      )
      .bind(childProjectId)
      .first<{
        id: string;
        group_id: string;
        parent_id: string | null;
        name: string;
      }>();
    if (!child || !child.parent_id) {
      throw new Error("子プロジェクトが見つかりません");
    }
    parentProjectId = child.parent_id;
    groupId = child.group_id;
  }

  let parent: ProjectRow | null = null;
  if (parentProjectId) {
    parent = await db
      .prepare(
        `SELECT id, group_id, parent_id, name, position, due_date, start_date, completed_at, created_at, storage_path, leader_user_id
         FROM pm_projects WHERE id = ?`
      )
      .bind(parentProjectId)
      .first<ProjectRow>();
    if (!parent) {
      throw new Error("親プロジェクトが見つかりません");
    }
    if (parent.parent_id) {
      throw new Error("親プロジェクト ID が不正です");
    }
    groupId = parent.group_id;
  }

  if (!groupId) {
    throw new Error("group_id を指定してください");
  }

  const membership = await requireGroupMembership(db, userId, groupId);
  const admin = await resolveProjectAdmin(
    db,
    userId,
    groupId,
    membership.group_role_weight ?? 0
  );

  const assigneeIds = [
    ...new Set(
      (input.assignee_ids?.length
        ? input.assignee_ids
        : input.assignee_id
          ? [input.assignee_id]
          : []
      )
        .map((id) => String(id ?? "").trim())
        .filter(Boolean)
    ),
  ];
  if (assigneeIds.length === 0) {
    throw new Error("担当者を1人以上選択してください");
  }

  const leaderIds =
    parent != null ? await listParentLeaderIds(db, parent.id) : new Set<string>();
  const isLeader = leaderIds.has(userId);

  if (isLeader && parent && !childProjectId) {
    throw new Error("割り当て子プロジェクトを選択してください");
  }

  const parentMemberIds =
    parent != null ? await listParentMemberIds(db, parent.id) : new Set<string>();

  for (const assigneeId of assigneeIds) {
    await assertAssigneeInGroup(db, groupId, assigneeId);

    const isSelf = assigneeId === userId;
    if (!isSelf && !admin.isAdmin) {
      if (!isLeader) {
        throw new Error("自分または管理者のみ他メンバーにタスクを発行できます");
      }
      if (!parentMemberIds.has(assigneeId)) {
        throw new Error(
          "この親プロジェクトの担当者にのみタスクを発行できます"
        );
      }
    }
  }

  const timestamp = now();

  for (const assigneeId of assigneeIds) {
    const id = createId("pmtask");
    await db
      .prepare(
        `INSERT INTO pm_tasks
           (id, group_id, parent_project_id, child_project_id, title, description,
            due_date, status, assignee_id, created_by, completed_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)`
      )
      .bind(
        id,
        groupId,
        parentProjectId,
        childProjectId,
        title,
        description,
        dueDate,
        status,
        assigneeId,
        userId,
        timestamp,
        timestamp
      )
      .run();

    await recordActivity(db, {
      group_id: groupId,
      parent_project_id: parentProjectId,
      actor_user_id: userId,
      action: "created_task",
      target_type: "task",
      target_id: id,
      target_name: title,
    });
  }

  return taskMutationResult(db, groupId, userId);
}

/** タスクを更新（担当者または管理者） */
export async function updateTask(
  db: D1Database,
  userId: string,
  taskId: string,
  input: {
    title?: string;
    description?: string;
    due_date?: string | null;
    status?: PmTaskStatus;
    child_project_id?: string | null;
  }
): Promise<{
  projects: PmParentProject[];
  tasks: PmTask[];
  completed_tasks: PmTask[];
  member_board: PmMemberBoard[];
}> {
  const task = await db
    .prepare(
      `SELECT id, group_id, parent_project_id, child_project_id, title, assignee_id
       FROM pm_tasks WHERE id = ?`
    )
    .bind(taskId)
    .first<{
      id: string;
      group_id: string;
      parent_project_id: string | null;
      child_project_id: string | null;
      title: string;
      assignee_id: string;
    }>();

  if (!task) {
    throw new Error("タスクが見つかりません");
  }

  await assertCanManageTask(db, userId, task);

  const updates: string[] = [];
  const values: unknown[] = [];

  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) throw new Error("タスクの内容を入力してください");
    if (title.length > 200) {
      throw new Error("タスクの内容は200文字以内にしてください");
    }
    updates.push("title = ?");
    values.push(title);
  }

  if (input.description !== undefined) {
    const description = input.description.trim();
    if (description.length > 2000) {
      throw new Error("詳細は2000文字以内にしてください");
    }
    updates.push("description = ?");
    values.push(description);
  }

  if (input.due_date !== undefined) {
    let dueDate: string | null = null;
    if (input.due_date != null && String(input.due_date).trim()) {
      dueDate = String(input.due_date).trim();
      if (!DATE_RE.test(dueDate)) {
        throw new Error("納期の形式が不正です");
      }
    }
    updates.push("due_date = ?");
    values.push(dueDate);
  }

  if (input.status !== undefined) {
    updates.push("status = ?");
    values.push(parseTaskStatus(input.status));
  }

  if (input.child_project_id !== undefined) {
    let childProjectId: string | null =
      input.child_project_id?.trim() || null;
    let parentProjectId = task.parent_project_id;

    if (childProjectId) {
      const child = await db
        .prepare(`SELECT id, parent_id, group_id FROM pm_projects WHERE id = ?`)
        .bind(childProjectId)
        .first<{
          id: string;
          parent_id: string | null;
          group_id: string;
        }>();
      if (!child || !child.parent_id) {
        throw new Error("子プロジェクトが見つかりません");
      }
      if (child.group_id !== task.group_id) {
        throw new Error("別グループの子プロジェクトは指定できません");
      }
      parentProjectId = child.parent_id;
    }

    updates.push("child_project_id = ?");
    values.push(childProjectId);
    updates.push("parent_project_id = ?");
    values.push(parentProjectId);
  }

  if (updates.length === 0) {
    return taskMutationResult(db, task.group_id, userId);
  }

  const timestamp = now();
  updates.push("updated_at = ?");
  values.push(timestamp);
  values.push(taskId);

  await db
    .prepare(`UPDATE pm_tasks SET ${updates.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();

  return taskMutationResult(db, task.group_id, userId);
}

/** タスクを削除（担当者または管理者） */
export async function deleteTask(
  db: D1Database,
  userId: string,
  taskId: string
): Promise<{
  projects: PmParentProject[];
  tasks: PmTask[];
  completed_tasks: PmTask[];
  member_board: PmMemberBoard[];
}> {
  const task = await db
    .prepare(
      `SELECT id, group_id, assignee_id, title, parent_project_id
       FROM pm_tasks WHERE id = ?`
    )
    .bind(taskId)
    .first<{
      id: string;
      group_id: string;
      assignee_id: string;
      title: string;
      parent_project_id: string | null;
    }>();

  if (!task) {
    throw new Error("タスクが見つかりません");
  }

  await assertCanManageTask(db, userId, task);

  await db.prepare(`DELETE FROM pm_tasks WHERE id = ?`).bind(taskId).run();

  return taskMutationResult(db, task.group_id, userId);
}

/** タスクを完了にする（担当者・管理者・リーダー） */
export async function completeTask(
  db: D1Database,
  userId: string,
  taskId: string
): Promise<{
  projects: PmParentProject[];
  tasks: PmTask[];
  completed_tasks: PmTask[];
  member_board: PmMemberBoard[];
}> {
  const task = await db
    .prepare(
      `SELECT t.id, t.group_id, t.parent_project_id, t.title, t.assignee_id,
              t.completed_at
       FROM pm_tasks t
       WHERE t.id = ?`
    )
    .bind(taskId)
    .first<{
      id: string;
      group_id: string;
      parent_project_id: string | null;
      title: string;
      assignee_id: string;
      completed_at: number | null;
    }>();

  if (!task) {
    throw new Error("タスクが見つかりません");
  }

  const membership = await requireGroupMembership(db, userId, task.group_id);
  const admin = await resolveProjectAdmin(
    db,
    userId,
    task.group_id,
    membership.group_role_weight ?? 0
  );

  const leaderIds = task.parent_project_id
    ? await listParentLeaderIds(db, task.parent_project_id)
    : new Set<string>();

  const canComplete =
    task.assignee_id === userId ||
    admin.isAdmin ||
    leaderIds.has(userId);

  if (!canComplete) {
    throw new Error("このタスクを完了にする権限がありません");
  }

  if (task.completed_at != null) {
    return taskMutationResult(db, task.group_id, userId);
  }

  const timestamp = now();
  await db
    .prepare(
      `UPDATE pm_tasks SET completed_at = ?, updated_at = ? WHERE id = ?`
    )
    .bind(timestamp, timestamp, taskId)
    .run();

  await recordActivity(db, {
    group_id: task.group_id,
    parent_project_id: task.parent_project_id,
    actor_user_id: userId,
    action: "completed_task",
    target_type: "task",
    target_id: taskId,
    target_name: task.title,
  });

  return taskMutationResult(db, task.group_id, userId);
}

/** グループ内の活動可能メンバーを日付ごとに取得 */
export async function listGroupAvailability(
  db: D1Database,
  groupId: string,
  from: string,
  to: string
): Promise<PmGroupAvailabilityDay[]> {
  if (!DATE_RE.test(from) || !DATE_RE.test(to)) {
    throw new Error("日付形式が不正です");
  }

  const result = await db
    .prepare(
      `SELECT a.avail_date, u.id AS user_id, u.display_name, u.username
       FROM pm_availability a
       JOIN users u ON u.id = a.user_id
       WHERE a.group_id = ?
         AND a.status = 'available'
         AND a.avail_date >= ? AND a.avail_date <= ?
       ORDER BY a.avail_date ASC, u.display_name COLLATE NOCASE, u.username`
    )
    .bind(groupId, from, to)
    .all<GroupAvailabilityRow>();

  const byDate = new Map<string, PmMember[]>();
  for (const row of result.results ?? []) {
    const members = byDate.get(row.avail_date) ?? [];
    members.push({
      id: row.user_id,
      display_name: row.display_name || row.username,
      username: row.username,
    });
    byDate.set(row.avail_date, members);
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, members]) => ({ date, members }));
}

export async function listAvailability(
  db: D1Database,
  groupId: string,
  userId: string,
  from: string,
  to: string
): Promise<PmAvailabilityEntry[]> {
  if (!DATE_RE.test(from) || !DATE_RE.test(to)) {
    throw new Error("日付形式が不正です");
  }

  const result = await db
    .prepare(
      `SELECT avail_date, status
       FROM pm_availability
       WHERE group_id = ? AND user_id = ?
         AND avail_date >= ? AND avail_date <= ?
       ORDER BY avail_date ASC`
    )
    .bind(groupId, userId, from, to)
    .all<AvailabilityRow>();

  return (result.results ?? []).map((row) => ({
    date: row.avail_date,
    status: row.status,
  }));
}

/** 活動可能日を一括設定 */
export async function setAvailability(
  db: D1Database,
  userId: string,
  input: {
    group_id: string;
    dates: string[];
    available: boolean;
  }
): Promise<PmAvailabilityEntry[]> {
  await requireGroupMembership(db, userId, input.group_id);

  const dates = [...new Set(input.dates.map((d) => d.trim()).filter(Boolean))];
  if (dates.length === 0) {
    throw new Error("dates を指定してください");
  }
  for (const date of dates) {
    if (!DATE_RE.test(date)) {
      throw new Error(`日付形式が不正です: ${date}`);
    }
  }

  const status: PmAvailabilityStatus = input.available
    ? "available"
    : "unavailable";
  const timestamp = now();

  for (const date of dates) {
    const existing = await db
      .prepare(
        `SELECT id FROM pm_availability
         WHERE group_id = ? AND user_id = ? AND avail_date = ?`
      )
      .bind(input.group_id, userId, date)
      .first<{ id: string }>();

    if (existing) {
      await db
        .prepare(
          `UPDATE pm_availability
           SET status = ?, updated_at = ?
           WHERE id = ?`
        )
        .bind(status, timestamp, existing.id)
        .run();
    } else {
      await db
        .prepare(
          `INSERT INTO pm_availability
             (id, group_id, user_id, avail_date, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          createId("pmavail"),
          input.group_id,
          userId,
          date,
          status,
          timestamp,
          timestamp
        )
        .run();
    }
  }

  const sorted = [...dates].sort();
  return listAvailability(
    db,
    input.group_id,
    userId,
    sorted[0]!,
    sorted[sorted.length - 1]!
  );
}

/** プロジェクト用 Excalidraw ノートを取得または作成 */
export async function getOrCreateProjectNote(
  db: D1Database,
  userId: string,
  projectId: string
): Promise<{ note_id: string; created: boolean }> {
  const project = await db
    .prepare(
      `SELECT id, group_id, name, excalidraw_note_id
       FROM pm_projects WHERE id = ?`
    )
    .bind(projectId)
    .first<{
      id: string;
      group_id: string;
      name: string;
      excalidraw_note_id: string | null;
    }>();

  if (!project) {
    throw new Error("プロジェクトが見つかりません");
  }

  await requireGroupMembership(db, userId, project.group_id);

  if (project.excalidraw_note_id) {
    const note = await db
      .prepare(`SELECT id FROM excalidraw_notes WHERE id = ?`)
      .bind(project.excalidraw_note_id)
      .first<{ id: string }>();
    if (note) {
      return { note_id: note.id, created: false };
    }
  }

  const noteId = await createGroupNote(
    db,
    userId,
    project.group_id,
    project.name
  );
  const ts = now();
  await db
    .prepare(
      `UPDATE pm_projects SET excalidraw_note_id = ?, updated_at = ? WHERE id = ?`
    )
    .bind(noteId, ts, projectId)
    .run();

  return { note_id: noteId, created: true };
}

/** ダッシュボードデータを取得 */
export async function getProjectDashboard(
  db: D1Database,
  userId: string,
  groupId?: string | null,
  from?: string | null,
  to?: string | null
): Promise<PmDashboard> {
  const allowed = await canUserAccessApp(db, userId, PROJECT_APP_SLUG);
  if (!allowed) {
    throw new Error("このアプリへのアクセス権限がありません");
  }

  const memberships = await getAccessibleMemberships(db, userId);
  if (memberships.length === 0) {
    throw new Error("利用可能なグループがありません");
  }

  const summaries = await Promise.all(
    memberships.map((m) => toGroupSummary(db, userId, m))
  );

  let selected = groupId
    ? summaries.find((g) => g.id === groupId)
    : undefined;
  if (!selected) {
    selected = summaries[0];
  }
  if (!selected) {
    throw new Error("利用可能なグループがありません");
  }

  const roles = await listGroupRoles(db, selected.id);
  const projects = await listProjects(db, selected.id, userId);
  const members = await listGroupMembers(db, selected.id);
  const [tasks, completed_tasks, member_board, recentActivity] = await Promise.all([
    listMyOpenTasks(db, selected.id, userId),
    listMyCompletedTasks(db, selected.id, userId),
    buildMemberBoard(db, selected.id, userId),
    listRecentActivity(db, selected.id, 30),
  ]);

  let availability: PmAvailabilityEntry[] = [];
  let group_availability: PmGroupAvailabilityDay[] = [];
  if (from && to && DATE_RE.test(from) && DATE_RE.test(to)) {
    availability = await listAvailability(db, selected.id, userId, from, to);
    group_availability = await listGroupAvailability(db, selected.id, from, to);
  }

  return {
    group: selected,
    groups: summaries.map((g) => (g.id === selected!.id ? selected! : g)),
    tasks,
    completed_tasks,
    projects,
    members,
    availability,
    group_availability,
    roles,
    can_edit_admin_settings: selected.is_admin,
    current_user_id: userId,
    recent_activity: recentActivity,
    member_board,
  };
}

/** 管理者資格の最低 weight を更新（グループ管理者のみ） */
export async function updateAdminSettings(
  db: D1Database,
  userId: string,
  groupId: string,
  minEligibleWeight: number
): Promise<PmGroupSummary> {
  if (!Number.isInteger(minEligibleWeight) || minEligibleWeight < 0) {
    throw new Error("min_eligible_weight は 0 以上の整数である必要があります");
  }

  const membership = await requireGroupMembership(db, userId, groupId);
  await assertGroupAdmin(db, userId, membership);

  const timestamp = now();
  await db
    .prepare(
      `INSERT INTO pm_admin_settings (group_id, min_eligible_weight, updated_by, updated_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(group_id) DO UPDATE SET
         min_eligible_weight = excluded.min_eligible_weight,
         updated_by = excluded.updated_by,
         updated_at = excluded.updated_at`
    )
    .bind(groupId, minEligibleWeight, userId, timestamp)
    .run();

  return toGroupSummary(db, userId, membership);
}
