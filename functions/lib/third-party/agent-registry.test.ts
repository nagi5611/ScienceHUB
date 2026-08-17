import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { Env } from "../types.js";
import {
  getTpAgent,
  listTpAgents,
  resolveTpTierModel,
  tpAgentGeminiOptions,
  TP_AGENT_REGISTRY,
} from "./agent-registry.js";
import {
  DEFAULT_TP_FLASH_MODEL,
  DEFAULT_TP_HIGH_MODEL,
  DEFAULT_TP_LITE_MODEL,
} from "./tp-flash.js";

const baseEnv = {} as Env;

describe("agent-registry", () => {
  it("lists all registered agents", () => {
    assert.equal(listTpAgents().length, Object.keys(TP_AGENT_REGISTRY).length);
  });

  it("resolves default tier models", () => {
    assert.equal(resolveTpTierModel(baseEnv, "lite"), DEFAULT_TP_LITE_MODEL);
    assert.equal(resolveTpTierModel(baseEnv, "flash"), DEFAULT_TP_FLASH_MODEL);
    assert.equal(resolveTpTierModel(baseEnv, "high"), DEFAULT_TP_HIGH_MODEL);
  });

  it("resolves env overrides per tier", () => {
    const env = {
      GEMINI_TP_LITE_MODEL: "lite-custom",
      GEMINI_TP_FLASH_MODEL: "flash-custom",
      GEMINI_TP_HIGH_MODEL: "high-custom",
    } as Env;
    assert.equal(resolveTpTierModel(env, "lite"), "lite-custom");
    assert.equal(resolveTpTierModel(env, "flash"), "flash-custom");
    assert.equal(resolveTpTierModel(env, "high"), "high-custom");
  });

  it("routes lite agents to lite model", () => {
    const opts = tpAgentGeminiOptions(baseEnv, "intent_classifier");
    assert.equal(opts.model, DEFAULT_TP_LITE_MODEL);
    assert.equal(opts.usageLabel, "lite_intent");
    assert.equal(opts.serviceTier, "STANDARD");
  });

  it("routes high agents to high model", () => {
    const opts = tpAgentGeminiOptions(baseEnv, "code_patch");
    assert.equal(opts.model, DEFAULT_TP_HIGH_MODEL);
    assert.equal(opts.usageLabel, "flash_patch");
  });

  it("uses FLEX tier for background-capable agents when requested", () => {
    const opts = tpAgentGeminiOptions(baseEnv, "code_editor", {
      background: true,
    });
    assert.equal(opts.serviceTier, "FLEX");
    assert.equal(opts.model, DEFAULT_TP_FLASH_MODEL);
  });

  it("keeps STANDARD for interactive agents even if background flag set", () => {
    const opts = tpAgentGeminiOptions(baseEnv, "maintain_step", {
      background: true,
    });
    assert.equal(opts.serviceTier, "STANDARD");
  });

  it("assigns retry editor to high tier", () => {
    const agent = getTpAgent("code_editor_retry");
    assert.equal(agent.tier, "high");
    assert.equal(agent.profile, "flash_edit_plan_retry");
  });
});
