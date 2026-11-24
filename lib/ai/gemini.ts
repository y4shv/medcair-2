// Thin server-side wrapper around the Google Gemini API (free tier via Google AI Studio).
// Needs GEMINI_API_KEY in the environment. Never import this from client code.

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const url = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

export type AiPart =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

export class AiNotConfiguredError extends Error {
  constructor() {
    super("The AI is not set up yet: GEMINI_API_KEY is missing on the server.");
  }
}

export async function askAi(opts: {
  system: string;
  parts: AiPart[];
  maxTokens?: number;
}): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new AiNotConfiguredError();

  const res = await fetch(url(GEMINI_MODEL), {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: opts.system }] },
      contents: [{ role: "user", parts: opts.parts }],
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: opts.maxTokens ?? 4096,
        temperature: 0.2,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("Gemini API error", res.status, body.slice(0, 500));
    if (res.status === 429) throw new Error("The free AI limit was reached. Please try again in a minute.");
    throw new Error(`The AI service returned an error (${res.status}).`);
  }
  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = (json.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join("");
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
