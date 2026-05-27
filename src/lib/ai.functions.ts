import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

async function callAI(messages: Array<{ role: string; content: string }>) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY is not configured");
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, messages }),
  });
  if (res.status === 429) throw new Error("Rate limit exceeded — please try again in a moment.");
  if (res.status === 402) throw new Error("AI credits exhausted — please top up in Settings > Workspace > Usage.");
  if (!res.ok) {
    const t = await res.text();
    console.error("AI gateway error:", res.status, t);
    throw new Error("AI gateway error");
  }
  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? "";
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      tone: z.enum(["Formal", "Informal", "Persuasive", "Friendly", "Apologetic"]),
      audience: z.enum(["Client", "Manager", "Team", "Vendor", "Investor"]),
      message: z.string().min(3).max(4000),
      subjectHint: z.string().max(200).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const system =
      "You are ExecutiveMind, an elite executive email writer. Produce ready-to-send professional emails. Output ONLY the email with a Subject line first, then a blank line, then the body. Do not add commentary.";
    const user = `Write an email.
Tone: ${data.tone}
Audience: ${data.audience}
${data.subjectHint ? `Subject hint: ${data.subjectHint}` : ""}
Core message / context:
${data.message}`;
    const content = await callAI([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);
    return { content };
  });

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      notes: z.string().min(10).max(20000),
      includeDeadlines: z.boolean(),
    }),
  )
  .handler(async ({ data }) => {
    const system = `You are ExecutiveMind, a meeting notes analyst. Produce a clean markdown summary with these sections:
## Summary
A 3-5 sentence overview.
## Key Points
- bullet list
## Decisions
- decisions made
## Action Items
- [ ] Owner — task
${data.includeDeadlines ? "## Deadlines & Responsibilities\nList every deadline with owner and date." : ""}
Be concise and factual. Do not invent details.`;
    const content = await callAI([
      { role: "system", content: system },
      { role: "user", content: data.notes },
    ]);
    return { content };
  });

export const researchAssistant = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      input: z.string().min(3).max(8000),
      mode: z.enum(["tldr", "executive"]),
    }),
  )
  .handler(async ({ data }) => {
    const isUrl = /^https?:\/\//i.test(data.input.trim());
    const system =
      data.mode === "tldr"
        ? "You are ExecutiveMind Research. Provide a TL;DR as 5-8 sharp bullet points. No fluff."
        : "You are ExecutiveMind Research. Produce an Executive Brief in markdown with: ## Overview, ## Key Insights, ## Risks & Considerations, ## Recommendations. Be concise and decision-oriented.";
    const user = isUrl
      ? `Research the topic at this URL based on what you know about it: ${data.input}. If unfamiliar, infer the likely topic and clearly note the assumption.`
      : `Topic / content to research:\n${data.input}`;
    const content = await callAI([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);
    return { content };
  });

export const chatAssistant = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      messages: z
        .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(8000) }))
        .min(1)
        .max(50),
    }),
  )
  .handler(async ({ data }) => {
    const content = await callAI([
      {
        role: "system",
        content:
          "You are ExecutiveMind, a friendly, sharp workplace assistant. Help with productivity, writing, planning, and quick research. Be concise, use markdown when helpful, and never invent facts.",
      },
      ...data.messages,
    ]);
    return { content };
  });
