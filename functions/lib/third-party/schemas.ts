/**
 * サードパーティ Gemini パイプライン — JSON スキーマ定義
 */

export const TP_WORKFLOW_PHASES = [
  "discovery",
  "clarify",
  "structured_form",
  "gate_deepen_or_build",
  "deepen_requirements",
  "write_req_and_plan",
  "flash_review",
  "flash_revise_plan",
  "flash_implement",
  "await_implement_confirm",
  "draft_ready",
] as const;

export type TpWorkflowPhase = (typeof TP_WORKFLOW_PHASES)[number];

export interface StructuredFormQuestion {
  id: string;
  prompt: string;
  allow_multiple: boolean;
  options: string[];
  allow_free_text: boolean;
}

export interface StructuredForm {
  title: string;
  questions: StructuredFormQuestion[];
}

export interface LiteTurnResult {
  assistant_message: string;
  context_summary: string;
  next_phase: TpWorkflowPhase;
  pending_form?: StructuredForm | null;
  gate_choice_ids?: string[];
}

export const LITE_TURN_SCHEMA = {
  type: "OBJECT",
  properties: {
    assistant_message: { type: "STRING" },
    context_summary: { type: "STRING" },
    next_phase: { type: "STRING" },
    pending_form: {
      type: "OBJECT",
      nullable: true,
      properties: {
        title: { type: "STRING" },
        questions: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              id: { type: "STRING" },
              prompt: { type: "STRING" },
              allow_multiple: { type: "BOOLEAN" },
              options: { type: "ARRAY", items: { type: "STRING" } },
              allow_free_text: { type: "BOOLEAN" },
            },
            required: [
              "id",
              "prompt",
              "allow_multiple",
              "options",
              "allow_free_text",
            ],
          },
        },
      },
      required: ["title", "questions"],
    },
    gate_choice_ids: {
      type: "ARRAY",
      items: { type: "STRING" },
      nullable: true,
    },
  },
  required: ["assistant_message", "context_summary", "next_phase"],
} as const;

export interface LiteDocsResult {
  requirements_markdown: string;
  plan_markdown: string;
  assistant_message: string;
}

export const LITE_DOCS_SCHEMA = {
  type: "OBJECT",
  properties: {
    requirements_markdown: { type: "STRING" },
    plan_markdown: { type: "STRING" },
    assistant_message: { type: "STRING" },
  },
  required: ["requirements_markdown", "plan_markdown", "assistant_message"],
} as const;

export interface PlanReviewIssue {
  category: string;
  severity: string;
  detail: string;
}

export interface PlanReviewResult {
  passed: boolean;
  summary: string;
  issues: PlanReviewIssue[];
  revised_plan_markdown?: string;
}

export const PLAN_REVIEW_SCHEMA = {
  type: "OBJECT",
  properties: {
    passed: { type: "BOOLEAN" },
    summary: { type: "STRING" },
    issues: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          category: { type: "STRING" },
          severity: { type: "STRING" },
          detail: { type: "STRING" },
        },
        required: ["category", "severity", "detail"],
      },
    },
    revised_plan_markdown: { type: "STRING", nullable: true },
  },
  required: ["passed", "summary", "issues"],
} as const;

export interface FlashImplementResult {
  index_html: string;
  assistant_message: string;
}

export const FLASH_IMPLEMENT_SCHEMA = {
  type: "OBJECT",
  properties: {
    index_html: { type: "STRING" },
    assistant_message: { type: "STRING" },
  },
  required: ["index_html", "assistant_message"],
} as const;

export function isTpWorkflowPhase(value: string): value is TpWorkflowPhase {
  return (TP_WORKFLOW_PHASES as readonly string[]).includes(value);
}
