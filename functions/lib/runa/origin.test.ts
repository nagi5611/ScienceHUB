import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Env } from "../types.js";
import {
  buildRunaPublicWebUrl,
  resolveRunaPublicOrigin,
} from "./origin.js";

describe("resolveRunaPublicOrigin", () => {
  it("defaults to s.mmh-virtual.jp", () => {
    assert.equal(resolveRunaPublicOrigin({} as Env), "https://s.mmh-virtual.jp");
  });

  it("uses OAUTH_REDIRECT_BASE when set", () => {
    assert.equal(
      resolveRunaPublicOrigin({
        OAUTH_REDIRECT_BASE: "https://s.mmh-virtual.jp/",
      } as unknown as Env),
      "https://s.mmh-virtual.jp"
    );
  });
});

describe("buildRunaPublicWebUrl", () => {
  const env = {} as Env;

  it("builds site root URL", () => {
    assert.equal(
      buildRunaPublicWebUrl(env, "matsuyama-minami-airport-diorama"),
      "https://s.mmh-virtual.jp/web/matsuyama-minami-airport-diorama/"
    );
  });

  it("builds nested file URL", () => {
    assert.equal(
      buildRunaPublicWebUrl(env, "demo", "assets/map.png"),
      "https://s.mmh-virtual.jp/web/demo/assets/map.png"
    );
  });
});
