import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildSiteDestPath } from "./web-bridge.js";

describe("buildSiteDestPath", () => {
  it("places file at site root when dest prefix is empty", () => {
    assert.equal(
      buildSiteDestPath("", "u/alice/sites/demo/index.html", "sites/demo/index.html"),
      "index.html"
    );
  });

  it("places file under dest prefix", () => {
    assert.equal(
      buildSiteDestPath("assets", "u/alice/logo.png", "logo.png"),
      "assets/logo.png"
    );
  });

  it("rejects disallowed extensions", () => {
    assert.throws(() => buildSiteDestPath("", "u/alice/run.exe", "run.exe"));
  });
});
