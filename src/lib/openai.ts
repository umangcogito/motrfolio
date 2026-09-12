import OpenAI from "openai";

/** OpenAI client. Returns null if the key isn't configured. */
export function getOpenAI(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

// Configurable via env so the model can be swapped without a code change.
export const TEXT_MODEL = process.env.OPENAI_TEXT_MODEL || "gpt-4o";
export const TRANSCRIBE_MODEL = process.env.OPENAI_TRANSCRIBE_MODEL || "gpt-4o-transcribe";
