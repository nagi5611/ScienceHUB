/**
 * ロール重み — クライアント側アクセス展開
 */

/** プリセット slug と重み */
export const GROUP_ROLE_WEIGHT_PRESETS = {
  teacher: 10,
  student: 5,
  guest: 1,
};

/** フォーム入力から重みを取得 */
export function parseRoleWeightInput(value) {
  const weight = Number(value);
  return Number.isInteger(weight) ? weight : null;
}

/** 明示選択から重みで展開した許可 ID 集合 */
export function expandRoleIdsByWeight(explicitRoleIds, groupRoles) {
  if (!explicitRoleIds.length) return new Set();

  const weightById = new Map(groupRoles.map((role) => [role.id, role.weight ?? 1]));
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
    if ((role.weight ?? 1) > minWeight) {
      allowed.add(role.id);
    }
  }

  return allowed;
}

/** プリセット slug のロール ID を取得 */
export function getPresetRoleIds(groupRoles) {
  const slugs = Object.keys(GROUP_ROLE_WEIGHT_PRESETS);
  return groupRoles
    .filter((role) => slugs.includes(role.slug))
    .map((role) => role.id);
}
