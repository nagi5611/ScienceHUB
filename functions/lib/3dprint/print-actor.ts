import { getSessionUserById } from "../auth";
import type { Env } from "../types";
import { getMemberByUserId, type Member } from "./reservations";

export type PrintActorContext = {
  user_id: string;
  user_display_name: string;
  user_username: string;
  member_id: string | null;
  member_name: string | null;
  member_homeroom: string | null;
};

/** Resolve the logged-in ScienceHUB user and optional linked print staff member. */
export async function resolvePrintActorContext(
  env: Env,
  db: D1Database,
  userId: string
): Promise<PrintActorContext | null> {
  const user = await getSessionUserById(env, db, userId);
  if (!user) return null;

  const member = await getMemberByUserId(db, userId);
  return {
    user_id: user.id,
    user_display_name: user.display_name,
    user_username: user.username,
    member_id: member?.id ?? null,
    member_name: member?.name ?? null,
    member_homeroom: member?.homeroom ?? null,
  };
}

export function formatPrintActorShort(ctx: PrintActorContext): string {
  if (ctx.member_name) {
    return `${ctx.user_display_name}（印刷担当: ${ctx.member_name}）`;
  }
  return `${ctx.user_display_name}（印刷担当未紐づけ）`;
}

export function formatPrintActorLogLabel(ctx: PrintActorContext): string {
  return formatPrintActorShort(ctx);
}

export type PrintActorNoticeExtra = {
  /** Assigned print staff for this reservation action (may differ from operator link). */
  assigned_staff_name?: string | null;
  assigned_staff_homeroom?: string | null;
  action_label?: string;
};

/** Multi-line block for Discord / email footers. */
export function formatPrintActorNoticeLines(
  ctx: PrintActorContext,
  extra?: PrintActorNoticeExtra
): string[] {
  const lines = [
    `ScienceHUB操作者: ${ctx.user_display_name} (@${ctx.user_username})`,
  ];
  if (ctx.member_name) {
    lines.push(`操作者の印刷担当紐づけ: ${ctx.member_name}（${ctx.member_homeroom ?? "—"}）`);
  } else {
    lines.push("操作者の印刷担当紐づけ: 未設定");
  }
  if (extra?.assigned_staff_name) {
    const hr = extra.assigned_staff_homeroom ? `（${extra.assigned_staff_homeroom}）` : "";
    lines.push(`処理対象の印刷担当: ${extra.assigned_staff_name}${hr}`);
  }
  if (extra?.action_label) {
    lines.push(`操作: ${extra.action_label}`);
  }
  return lines;
}

export function memberDisplayName(member: Member): string {
  return `${member.name}（${member.homeroom}）`;
}
