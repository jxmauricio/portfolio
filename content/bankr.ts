import type { BankrPoint } from "./types";

export const bankr = {
  name: "Bankr",
  tagline: "An AI-first personal finance app that shows its work.",
  summary:
    "Ask Bankr about your money and every dollar figure in the answer is cited to the transaction or account it came from. If a number can't be traced, Bankr flags it instead of guessing.",
  status: "Private beta",
  // [PLACEHOLDER] public repo URL once it's open.
  repoUrl: null as string | null,
  // [PLACEHOLDER] link to the LinkedIn article on evals.
  articleUrl: null as string | null,
  articleTitle: "How evals fixed my chatbot's math",
  stack: [
    "FastAPI",
    "React + Vite",
    "Expo",
    "Postgres (Supabase)",
    "Plaid",
    "Render",
    "Vercel",
    "OpenRouter",
    "Anthropic",
  ],
  // Short versions for the home page feature.
  highlights: [
    "Every dollar figure in a chat answer is cited, and uncited figures get flagged.",
    "A nightly eval run checks answers against a hand-verified golden ledger.",
    "The agent proposes changes. You confirm them.",
  ],
  points: [
    {
      title: "Cited numbers",
      body: "Every dollar figure in a chat answer links back to its source. Figures the model can't cite are flagged in the UI so you never have to wonder where a number came from.",
    },
    {
      title: "Evals against a golden ledger",
      body: "An eval harness scores answers against a hand-verified ledger, and a nightly regression run catches math that drifts after a prompt or model change.",
    },
    {
      title: "Propose, then confirm",
      body: "The agent can suggest goals, rules, and budget moves, but it only proposes them. Nothing changes until you confirm.",
    },
    {
      title: "Categorization that learns",
      body: "The categorization pipeline learns from your corrections, so the same merchant stops landing in the wrong bucket.",
    },
    {
      title: "MCP server with OAuth",
      body: "Claude and ChatGPT can connect to Bankr over MCP with OAuth, with either read access or read plus propose.",
    },
    {
      title: "Cost and latency",
      body: "Prompt caching and provider routing through OpenRouter and Anthropic keep responses quick and the bill small.",
    },
  ] satisfies BankrPoint[],
};
