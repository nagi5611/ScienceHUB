/**
 * ロール重み — アクセス許可の展開
 */

export interface WeightedRole {
  id: string;
  weight: number;
}

/** 明示選択されたロール ID から、重みで展開した許可 ID 集合を返す */
export function expandRoleIdsByWeight(
  explicitRoleIds: string[],
  groupRoles: WeightedRole[]
): Set<string> {
  if (explicitRoleIds.length === 0) {
    return new Set();
  }

  const weightById = new Map(groupRoles.map((role) => [role.id, role.weight]));
  let minWeight = Number.POSITIVE_INFINITY;

  for (const roleId of explicitRoleIds) {
    const weight = weightById.get(roleId);
    if (weight !== undefined && weight < minWeight) {
      minWeight = weight;
    }
  }

  if (!Number.isFinite(minWeight)) {
    return new Set(explicitRoleIds);
  }

  const allowed = new Set(explicitRoleIds);
  for (const role of groupRoles) {
    if (role.weight > minWeight) {
      allowed.add(role.id);
    }
  }

  return allowed;
}

/** 重みが整数か検証 */
export function parseRoleWeight(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isInteger(parsed)) {
      return parsed;
    }
  }
  return null;
}
