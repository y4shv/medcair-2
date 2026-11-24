// Thin server-side wrapper around the Anthropic Messages API (no SDK needed).
// Needs ANTHROPIC_API_KEY in the environment. Never import this from client code.

const API_URL = "https://api.anthropic.com/v1/messages";
export const CLAUDE_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

export type ClaudeContent =
  | { type: "text"; text: string }
  | {
      type: "document";
      source: { type: "base64"; media_type: "application/pdf"; data: string };
    }
  | {
      type: "image";
      source: { type: "base64"; media_type: string; data: string };
    };

export class AiNotConfiguredError extends Error {
  constructor() {
    super("The AI is not set up yet: ANTHROPIC_API_KEY is missing on the server.");
  }
}

export async function askClaude(opts: {
  system: string;
  content: ClaudeContent[];
  maxTokens?: number;
}): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new AiNotConfiguredError();

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: opts.maxTokens ?? 4096,
      system: opts.system,
      messages: [{ role: "user", content: opts.content }],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("Claude API error", res.status, body.slice(0, 500));
    throw new Error(`The AI service returned an error (${res.status}).`);
  }
  const json = (await res.json()) as { content?: { type: string; text?: string }[] };
  const text = (json.content ?? [])
    .filter((b) => b.type === "text")
    .map((b) => b.text ?? "")
    .join("");
  if (!text) throw new Error("The AI returned an empty answer.");
  return text;
}

/** Pulls the first JSON object out of a model answer (tolerates ```json fences). */
export function parseJsonObject(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("The AI did not return structured data.");
  return JSON.parse(text.slice(start, end + 1));
}
