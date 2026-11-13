// ============================================================
// ZIG Creative: AI receptionist demo (Netlify Function)
// Runs on Netlify's servers, never in the visitor's browser,
// so the Anthropic API key stays secret.
//
// Needs one environment variable in Netlify:
//   ANTHROPIC_API_KEY  = your key from console.anthropic.com
// Optional:
//   ANTHROPIC_MODEL    = model ID (default: claude-haiku-5-5)
//   ALLOWED_ORIGIN     = extra site address allowed to call this,
//                        e.g. https://www.zigcreative.co.uk
// No npm packages needed.
// ============================================================

import { SYSTEM_PROMPT } from "./clinic.mjs";

const API_URL = "https://api.anthropic.com/v1/messages";
const MAX_MESSAGES = 30;        // whole conversation, both sides
const MAX_CHARS = 800;          // per visitor message
const MAX_REPLY_TOKENS = 450;

export const config = { path: "/api/receptionist" };

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
  });
}

function originAllowed(req) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // same-origin requests from some browsers omit it
  try {
    const o = new URL(origin).host;
    const self = new URL(req.url).host;
    const extra = process.env.ALLOWED_ORIGIN ? new URL(process.env.ALLOWED_ORIGIN).host : null;
    return o === self || o === extra;
  } catch {
    return false;
  }
}

function cleanMessages(input) {
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_MESSAGES) return null;
  const out = [];
  for (let i = 0; i < input.length; i++) {
    const m = input[i];
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") return null;
    const text = m.content.trim().slice(0, m.role === "user" ? MAX_CHARS : 4000);
    if (!text) return null;
    // roles must alternate, starting and ending with the visitor
    const expected = i % 2 === 0 ? "user" : "assistant";
    if (m.role !== expected) return null;
    out.push({ role: m.role, content: text });
  }
  return out[out.length - 1].role === "user" ? out : null;
}

export default async (req) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  if (!originAllowed(req)) return json({ error: "forbidden" }, 403);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return json({ error: "not_configured" }, 503);

  let body;
  try { body = await req.json(); } catch { return json({ error: "bad_request" }, 400); }

  const messages = cleanMessages(body && body.messages);
  if (!messages) return json({ error: "bad_request" }, 400);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-haiku-5-5",
        max_tokens: MAX_REPLY_TOKENS,
        system: SYSTEM_PROMPT,
        messages
      }),
      signal: AbortSignal.timeout(25000)
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Anthropic API error", res.status, detail.slice(0, 500));
      const code = res.status === 429 ? "busy" : (res.status === 401 ? "bad_key" : "upstream_error");
      return json({ error: code }, 502);
    }

    const data = await res.json();
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    if (!text) return json({ error: "empty_reply" }, 502);
    return json({ reply: text });
  } catch (err) {
    console.error("Receptionist function error", err);
    return json({ error: "upstream_error" }, 502);
  }
};
