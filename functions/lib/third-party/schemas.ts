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
    "flash_implement_tasks",
    "await_implement_confirm",
  "draft_ready",
  "app_maintain",
  "app_maintain_done",
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

export type MaintainAgentAction =
  | "list"
  | "read"
  | "grep"
  | "analyze"
  | "apply_edits"
  | "patch_html"
  | "reply";

export interface WorkspaceEditOpJson {
  op: string;
  start_line?: number;
  end_line?: number;
  line?: number;
  content?: string;
}

export interface MaintainAgentStep {
  action: MaintainAgentAction | string;
  assistant_message: string;
  path?: string;
  line_start?: number;
  line_end?: number;
  pattern?: string;
  index_html?: string;
  edits?: WorkspaceEditOpJson[];
}

export const WORKSPACE_EDIT_OP_SCHEMA = {
  type: "OBJECT",
  properties: {
    op: {
      type: "STRING",
      description:
        "replace_lines | insert_after | insert_before | delete_lines",
    },
    start_line: {
      type: "INTEGER",
      nullable: true,
      description: "replace_lines / delete_lines の開始行（L001 の番号）",
    },
    end_line: {
      type: "INTEGER",
      nullable: true,
      description: "replace_lines / delete_lines の終了行（含む）",
    },
    line: {
      type: "INTEGER",
      nullable: true,
      description: "insert_after / insert_before の基準行",
    },
    content: {
      type: "STRING",
      nullable: true,
      description:
        "挿入・置換後のテキスト。改行可。delete_lines では不要",
    },
  },
  required: ["op"],
} as const;

export const MAINTAIN_EDIT_PLAN_SCHEMA = {
  type: "OBJECT",
  properties: {
    assistant_message: {
      type: "STRING",
      description: "ユーザー向け日本語。HTML ソースは書かない",
    },
    edits: {
      type: "ARRAY",
      description: "index.html への行単位編集。最小件数でタスクを満たす",
      items: WORKSPACE_EDIT_OP_SCHEMA,
    },
  },
  required: ["assistant_message", "edits"],
} as const;

/** 段階実装: 編集先ファイルを明示してから行番号 edits のみ返す */
export const IMPLEMENT_EDIT_PLAN_SCHEMA = {
  type: "OBJECT",
  properties: {
    target_path: {
      type: "STRING",
      description: "編集対象ファイル。常に index.html",
    },
    assistant_message: {
      type: "STRING",
      description: "ユーザー向け日本語。HTML ソースは書かない",
    },
    edits: {
      type: "ARRAY",
      description:
        "target_path のファイルへの行単位編集。L001 の行番号と一致。content は該当ブロック内のテキストのみ",
      items: WORKSPACE_EDIT_OP_SCHEMA,
    },
  },
  required: ["target_path", "assistant_message", "edits"],
} as const;

export interface MaintainEditPlanResult {
  assistant_message: string;
  edits: WorkspaceEditOpJson[];
  target_path?: string;
}

export const MAINTAIN_AGENT_STEP_SCHEMA = {
  type: "OBJECT",
  properties: {
    action: { type: "STRING" },
    assistant_message: { type: "STRING" },
    path: { type: "STRING", nullable: true },
    line_start: { type: "INTEGER", nullable: true },
    line_end: { type: "INTEGER", nullable: true },
    pattern: { type: "STRING", nullable: true },
    index_html: { type: "STRING", nullable: true },
    edits: {
      type: "ARRAY",
      nullable: true,
      items: WORKSPACE_EDIT_OP_SCHEMA,
    },
  },
  required: ["action", "assistant_message"],
} as const;

export function isPostBuildPhase(phase: string): boolean {
  return (
    phase === "draft_ready" ||
    phase === "app_maintain" ||
    phase === "app_maintain_done"
  );
}

export type TpChatMode = "agent" | "ask";

export function parseTpChatMode(value: unknown): TpChatMode {
  return value === "ask" ? "ask" : "agent";
}

export function isTpWorkflowPhase(value: string): value is TpWorkflowPhase {
  return (TP_WORKFLOW_PHASES as readonly string[]).includes(value);
}

export type ImplementationTaskTarget =
  | "skeleton"
  | "markup"
  | "styles"
  | "script"
  | "polish";

export interface ImplementationTask {
  id: string;
  title: string;
  depends_on: string[];
  target: ImplementationTaskTarget;
  acceptance_hint: string;
  status: "pending" | "done" | "failed";
}

export interface ImplementationTasksFile {
  version: 1;
  current_task_index: number;
  tasks: ImplementationTask[];
}

export const IMPLEMENTATION_TASKS_PLAN_SCHEMA = {
  type: "OBJECT",
  properties: {
    tasks: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING" },
          title: { type: "STRING" },
          depends_on: { type: "ARRAY", items: { type: "STRING" } },
          target: { type: "STRING" },
          acceptance_hint: { type: "STRING" },
        },
        required: ["id", "title", "depends_on", "target", "acceptance_hint"],
      },
    },
  },
  required: ["tasks"],
} as const;

export interface ImplementationTasksPlanResult {
  tasks: Array<{
    id: string;
    title: string;
    depends_on: string[];
    target: string;
    acceptance_hint: string;
  }>;
}
