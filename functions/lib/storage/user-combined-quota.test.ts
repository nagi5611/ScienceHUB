import assert from "node:assert/strict";
import { test } from "node:test";
import {
  canAllocateUserCombinedBytes,
  getCombinedUserUsedBytes,
} from "./user-combined-quota";
import type { StorageRootRow } from "./quota";

const userRoot: StorageRootRow = {
  id: "root_user",
  root_type: "user",
  user_id: "user_1",
  group_id: null,
  quota_bytes: 10 * 1024 ** 3,
  used_bytes: 4 * 1024 ** 3,
  created_at: 0,
  updated_at: 0,
};

test("getCombinedUserUsedBytes sums personal and website usage for user roots", () => {
  assert.equal(getCombinedUserUsedBytes(userRoot, 2 * 1024 ** 3), 6 * 1024 ** 3);
});

test("canAllocateUserCombinedBytes respects shared user quota", () => {
  assert.equal(
    canAllocateUserCombinedBytes(userRoot, 2 * 1024 ** 3, 3 * 1024 ** 3),
    true
  );
  assert.equal(
    canAllocateUserCombinedBytes(userRoot, 2 * 1024 ** 3, 4 * 1024 ** 3 + 1),
    false
  );
});
